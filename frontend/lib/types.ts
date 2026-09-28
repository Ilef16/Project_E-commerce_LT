export type Localized = { fr: string; ar: string };
export type Category = "keys" | "acc" | "chain" | "bag";

export interface Product {
  id: number;
  category: Category;
  name: Localized;
  price: number;
  discount: number | null;
  finalPrice: number;
}

export interface Collection {
  id: number;
  theme: { from: string; to: string };
  name: Localized;
  desc: Localized;
  products: Product[];
}

export interface Review {
  id: number;
  name: Localized;
  city: Localized | null;
  product: Localized | null;
  rating: number;
  text: Localized;
  createdAt: string;
}

export interface ReviewsResponse {
  average: number;
  count: number;
  items: Review[];
}
