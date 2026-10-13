export type Role = "owner" | "staff";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  businessId: string;
  businessName: string;
  role: Role;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  createdAt: number;
}

export type ProductInput = Pick<Product, "name" | "category" | "price" | "qty">;

/** One product line inside a sale. */
export interface SaleItem {
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
  total: number;
}

/** What the new-sale form sends for each row: which product and how many. */
export type SaleLine = Pick<SaleItem, "productId" | "qty">;

/** One transaction. A customer can buy several products in a single sale. */
export interface Sale {
  id: string;
  items: SaleItem[];
  /** The sum of every item's total. */
  total: number;
  soldById: string;
  soldByName: string;
  /** Milliseconds since epoch, so sales can be queried by date range. */
  createdAt: number;
}

export interface Member {
  /** The member's email, lowercased. */
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "invited";
  uid?: string;
}

export interface RegisterInput {
  businessName: string;
  name: string;
  email: string;
  password: string;
}

export interface DateRange {
  from: number;
  to: number;
}
