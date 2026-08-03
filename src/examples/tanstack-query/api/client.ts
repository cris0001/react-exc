// Cienki wrapper na fetch — JEDNO miejsce na baseUrl, nagłówki, obsługę błędów.
// W realnym projekcie tu wpinasz token z auth store'a, interceptory itd.

const BASE_URL = "https://jsonplaceholder.typicode.com"

export async function apiClient<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  // fetch NIE rzuca na 404/500 — musimy sami (TanStack Query złapie ten throw)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }

  return res.json() as Promise<T>
}
