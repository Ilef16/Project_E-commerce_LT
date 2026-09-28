import "server-only";
import type { Collection, Product, ReviewsResponse } from "./types";

// Appels serveur → API .NET (jamais depuis le navigateur).
const API = process.env.API_URL ?? "http://localhost:5175";

async function get<T>(path: string, revalidate: number): Promise<T | null> {
  try {
    const res = await fetch(`${API}/api${path}`, { next: { revalidate } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
    return (await res.json()) as T;
  } catch {
    // Si l'API est indisponible, on retourne null plutôt que de planter la page.
    return null;
  }
}

export const getFeaturedCollection = () => get<Collection>("/collections/featured", 60);
export const getProducts = async () => (await get<Product[]>("/products", 60)) ?? [];
export const getReviews = async () =>
  (await get<ReviewsResponse>("/reviews", 30)) ?? { average: 0, count: 0, items: [] };
