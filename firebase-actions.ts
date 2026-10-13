/**
 * Every read and write the app performs. Pages and components call these
 * functions and never talk to Firebase directly.
 *
 * Firestore layout
 *   users/{uid}                          profile: name, email, businessId, businessName, role
 *   businesses/{businessId}              name, ownerId, createdAt
 *   businesses/{businessId}/products/*   name, category, price, qty, createdAt
 *   businesses/{businessId}/sales/*      items[] (product, qty, unitPrice, total), total, soldById, soldByName, createdAt
 *   businesses/{businessId}/members/{email}   name, email, role, status, uid
 *   invites/{email}                      businessId, businessName, name, role
 *
 * Access is enforced by firestore.rules, not by this file.
 */
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { buildSaleItems, mergeSaleLines } from "./lib/sale-items";
import type {
  DateRange,
  Member,
  Product,
  ProductInput,
  RegisterInput,
  Sale,
  SaleLine,
  UserProfile,
} from "./lib/types";

const normaliseEmail = (email: string) => email.trim().toLowerCase();

const productsRef = (businessId: string) => collection(db, "businesses", businessId, "products");
const salesRef = (businessId: string) => collection(db, "businesses", businessId, "sales");
const membersRef = (businessId: string) => collection(db, "businesses", businessId, "members");

function cleanProduct(input: ProductInput): ProductInput {
  const name = input.name.trim();
  const price = Number(input.price);
  const qty = Math.floor(Number(input.qty));
  if (!name) throw new Error("Enter a product name.");
  if (!Number.isFinite(price) || price < 0) throw new Error("Enter a valid price.");
  if (!Number.isFinite(qty) || qty < 0) throw new Error("Enter a valid quantity.");
  return { name, category: input.category.trim(), price, qty };
}

/* ------------------------------- Auth ---------------------------------- */

async function getProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? ({ uid, ...snapshot.data() } as UserProfile) : null;
}

type AuthListener = (profile: UserProfile | null) => void;
const authListeners = new Set<AuthListener>();

/** Loads the current user's profile and hands it to everyone listening. */
async function emitProfile() {
  const user = auth.currentUser;
  const profile = user ? await getProfile(user.uid).catch(() => null) : null;
  authListeners.forEach((listener) => listener(profile));
}

/** Calls back with the signed-in user's profile, or null when signed out. */
export function subscribeToAuth(callback: AuthListener) {
  authListeners.add(callback);
  const unsubscribe = onAuthStateChanged(auth, () => void emitProfile());
  return () => {
    authListeners.delete(callback);
    unsubscribe();
  };
}

/**
 * Creates an account. If the owner of a business has already added this email
 * to their team, the new user joins that business as sales staff. Otherwise a
 * new business is created with this user as its owner.
 */
export async function registerAccount(input: RegisterInput) {

  const email = normaliseEmail(input.email);
  const businessName = input.businessName.trim();
  if (!businessName) throw new Error("Enter your business name.");

  const { user } = await createUserWithEmailAndPassword(auth, email, input.password);
  const inviteRef = doc(db, "invites", email);
  const invite = await getDoc(inviteRef);

  if (invite.exists()) {
    const { businessId, businessName: invitedTo, name, role } = invite.data();
    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, "users", user.uid), { name, email, businessId, businessName: invitedTo, role });
    await updateDoc(doc(membersRef(businessId), email), { status: "active", uid: user.uid });
    await deleteDoc(inviteRef);
    // Firebase announced the sign-in before the profile existed, so announce again.
    return emitProfile();
  }

  const name = input.name.trim();
  await updateProfile(user, { displayName: name });
  const business = await addDoc(collection(db, "businesses"), {
    name: businessName,
    ownerId: user.uid,
    createdAt: Date.now(),
  });
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    businessId: business.id,
    businessName,
    role: "owner",
  });
  await setDoc(doc(membersRef(business.id), email), {
    name,
    email,
    role: "owner",
    status: "active",
    uid: user.uid,
  });
  await emitProfile();
}

export async function login(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, normaliseEmail(email), password);
  // A member who was removed from a business still has a login but no profile.
  if (!(await getProfile(user.uid))) {
    await signOut(auth);
    throw new Error("This account no longer has access to a business. Ask the owner to add you again.");
  }
}

export async function logout() {
  await signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, normaliseEmail(email));
}

/* ------------------------------ Products ------------------------------- */

export async function getProducts(businessId: string): Promise<Product[]> {
  const snapshot = await getDocs(query(productsRef(businessId), orderBy("name")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Product);
}

export async function addProduct(businessId: string, input: ProductInput) {
  const product = cleanProduct(input);
  await addDoc(productsRef(businessId), { ...product, createdAt: Date.now() });
}

/**
 * Adds several products in one write. Products whose name already exists are
 * skipped, so importing the same list twice never creates duplicates.
 * Returns how many were added.
 */
export async function addProducts(businessId: string, inputs: ProductInput[]) {
  const existing = new Set(
    (await getProducts(businessId)).map((product) => product.name.trim().toLowerCase()),
  );
  const fresh = inputs
    .map(cleanProduct)
    .filter((product) => !existing.has(product.name.toLowerCase()));
  if (fresh.length === 0) return 0;

  const batch = writeBatch(db);
  const createdAt = Date.now();
  fresh.forEach((product) => batch.set(doc(productsRef(businessId)), { ...product, createdAt }));
  await batch.commit();
  return fresh.length;
}

export async function updateProduct(businessId: string, productId: string, input: ProductInput) {
  const product = cleanProduct(input);
  await updateDoc(doc(productsRef(businessId), productId), { ...product });
}

export async function deleteProduct(businessId: string, productId: string) {
  await deleteDoc(doc(productsRef(businessId), productId));
}

/* -------------------------------- Sales -------------------------------- */

/** Sales inside a date range, newest first. */
export async function getSales(businessId: string, range: DateRange): Promise<Sale[]> {
  const snapshot = await getDocs(
    query(
      salesRef(businessId),
      where("createdAt", ">=", range.from),
      where("createdAt", "<=", range.to),
      orderBy("createdAt", "desc"),
    ),
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Sale);
}

/**
 * Records one sale that can contain several products, and reduces the stock of
 * each in a single transaction. Either every item is saved or none are, so two
 * people selling the last item at the same time can't both succeed.
 */
export async function recordSale(seller: UserProfile, lines: SaleLine[]) {
  const merged = mergeSaleLines(lines);

  const saleRef = doc(salesRef(seller.businessId));

  await runTransaction(db, async (transaction) => {
    // Firestore requires every read in a transaction to come before any write.
    const stock = new Map<string, Omit<Product, "id">>();
    for (const { productId } of merged) {
      const snapshot = await transaction.get(doc(productsRef(seller.businessId), productId));
      if (snapshot.exists()) stock.set(productId, snapshot.data() as Omit<Product, "id">);
    }
    const items = buildSaleItems(merged, (productId) => stock.get(productId));

    for (const item of items) {
      transaction.update(doc(productsRef(seller.businessId), item.productId), {
        qty: stock.get(item.productId)!.qty - item.qty,
      });
    }
    transaction.set(saleRef, {
      items,
      total: items.reduce((sum, item) => sum + item.total, 0),
      soldById: seller.uid,
      soldByName: seller.name,
      createdAt: Date.now(),
    });
  });
}

/* -------------------------------- Team --------------------------------- */

export async function getMembers(businessId: string): Promise<Member[]> {
  const snapshot = await getDocs(membersRef(businessId));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Member);
}

/**
 * Adds someone to the team as sales staff. They become active when they create
 * an account with the same email address.
 */
export async function inviteMember(owner: UserProfile, name: string, email: string) {
  const memberName = name.trim();
  const address = normaliseEmail(email);
  if (!memberName) throw new Error("Enter the member's full name.");
  if (!/^\S+@\S+\.\S+$/.test(address)) throw new Error("Enter a valid email address.");

  const memberRef = doc(membersRef(owner.businessId), address);
  if ((await getDoc(memberRef)).exists()) {
    throw new Error("Someone with that email is already on your team.");
  }
  await setDoc(doc(db, "invites", address), {
    businessId: owner.businessId,
    businessName: owner.businessName,
    name: memberName,
    role: "staff",
  });
  await setDoc(memberRef, { name: memberName, email: address, role: "staff", status: "invited" });
}

/** Removes a member. Their past sales keep their name. */
export async function removeMember(businessId: string, member: Member) {
  if (member.role === "owner") throw new Error("The owner can't be removed.");
  await deleteDoc(doc(membersRef(businessId), member.id));
  if (member.status === "invited") await deleteDoc(doc(db, "invites", member.id));
  // Stops a removed member's existing login from reading the business.
  if (member.uid) await deleteDoc(doc(db, "users", member.uid));
}
