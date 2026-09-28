import type { Product } from "./types";

// [image, background-size, background-position] : recadrages des 2 photos (i1, i2) par catégorie.
const PHK: Record<string, [string, string, string]> = {
  bag: ["i2", "170%", "70% 55%"],
  bag2: ["i2", "190%", "80% 60%"],
  chain: ["i2", "250%", "45% 12%"],
  chain2: ["i2", "260%", "55% 20%"],
  keys: ["i2", "230%", "22% 52%"],
  keys2: ["i2", "260%", "24% 55%"],
  acc: ["i1", "220%", "45% 62%"],
  acc2: ["i1", "300%", "62% 58%"],
};

export function artFor(p: Pick<Product, "category" | "id">) {
  return PHK[p.category + (p.id % 2 === 0 ? "2" : "")] ?? PHK.acc;
}
