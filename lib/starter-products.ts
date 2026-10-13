import type { ProductInput } from "./types";

/** A ready-made product list an owner can import from the Products page. */
export const starterProducts: ProductInput[] = [
  { name: "Rice 50kg", category: "Grains", price: 78000, qty: 40 },
  { name: "Beans 5kg", category: "Grains", price: 9500, qty: 25 },
  { name: "Garri 10kg", category: "Grains", price: 7200, qty: 30 },
  { name: "Semovita 2kg", category: "Flour", price: 4500, qty: 35 },
  { name: "Wheat flour 2kg", category: "Flour", price: 3800, qty: 20 },
  { name: "Vegetable oil 5L", category: "Cooking", price: 14500, qty: 18 },
  { name: "Palm oil 4L", category: "Cooking", price: 9000, qty: 15 },
  { name: "Tomato paste 400g", category: "Cooking", price: 1500, qty: 60 },
  { name: "Seasoning cubes (pack of 50)", category: "Cooking", price: 1800, qty: 45 },
  { name: "Salt 1kg", category: "Cooking", price: 600, qty: 50 },
  { name: "Noodles carton", category: "Noodles", price: 14500, qty: 28 },
  { name: "Spaghetti 500g", category: "Pasta", price: 1200, qty: 64 },
  { name: "Sugar 1kg", category: "Baking", price: 3000, qty: 30 },
  { name: "Milk tin 400g", category: "Dairy", price: 1800, qty: 48 },
  { name: "Cocoa drink 500g", category: "Beverages", price: 4200, qty: 22 },
  { name: "Tea bags (box of 100)", category: "Beverages", price: 2500, qty: 16 },
  { name: "Bottled water (pack of 12)", category: "Drinks", price: 2400, qty: 40 },
  { name: "Soft drink 50cl (crate of 24)", category: "Drinks", price: 9600, qty: 12 },
  { name: "Bar soap", category: "Household", price: 700, qty: 80 },
  { name: "Detergent 1kg", category: "Household", price: 2900, qty: 26 },
];
