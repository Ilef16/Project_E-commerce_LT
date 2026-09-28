// Appels navigateur → Next.js (/backend/*) → API .NET (voir rewrites dans next.config.mjs).
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/backend${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export const getJson = <T>(path: string) => request<T>(path);
export const postJson = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });
