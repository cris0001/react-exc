// Query keys w JEDNYM miejscu — inaczej literówki i chaos przy invalidacji.
// Wzorzec hierarchiczny: invalidacja ['users'] unieważnia TEŻ ['users','detail',5],
// bo TanStack Query dopasowuje klucze prefiksem.

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
}
