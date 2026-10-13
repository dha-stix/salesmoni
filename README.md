# SalesMoni

Sales records and stock control for businesses. Built with Next.js (App Router), TypeScript,
Tailwind CSS, Framer Motion, and Firebase.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The app needs the Firebase keys in `.env.local` to start.

## Connect Firebase

1. Create a project at https://console.firebase.google.com and add a **Web app**.
2. Turn on **Authentication > Sign-in method > Email/Password**.
3. Create a **Firestore Database** (production mode).
4. Copy `.env.example` to `.env.local` and paste in the web app's config values.
5. Paste the contents of `firestore.rules` into **Firestore > Rules** and publish.
6. Restart `npm run dev`.

Firestore may ask you to create an index the first time sales are loaded; follow the link it
prints in the browser console.

## Pages

| Route            | What it does                                                        |
| ---------------- | ------------------------------------------------------------------- |
| `/`              | Homepage: hero, features, how it works, reports, call to action     |
| `/auth/login`    | Sign in with email and password                                     |
| `/auth/register` | Create a business account (business name required)                  |
| `/dashboard`     | Yearly sales chart, totals, top products, recent sales, low stock   |
| `/products`      | Add, edit, search, and delete products with price and quantity      |
| `/sales`         | Record a sale, browse any day on the calendar, download Excel files |
| `/team`          | Add sales staff who record sales under their own names              |

## Roles

- **Owner**: everything, including products, team, and Excel downloads.
- **Sales staff**: record sales and view products, the dashboard, and the team list.

To add staff, the owner enters their name and email on `/team`. When that person creates an
account with the same email they join the owner's business instead of creating a new one.

## Project structure

```
app/                 Routes. Each page only composes components.
components/          Page sections, grouped by page, plus shared ui/ and providers/.
images/              All images, exported from images/index.ts.
styles/globals.css   Theme colours, fonts, and reused style recipes (.card, .field-input, ...).
lib/                 Types, helpers, data hooks, and Excel export.
firebase.ts          Firebase initialisation.
firebase-actions.ts  Every read and write the app performs.
firestore.rules      Security rules to publish in the Firebase console.
```
