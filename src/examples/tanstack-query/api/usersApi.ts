import { apiClient } from "./client"
import type { User, CreateUserDto } from "../types/user"

// Warstwa API = SAME funkcje HTTP. Zero Reacta, zero hooków.
// Dzięki temu są testowalne i reużywalne (np. w Server Component / SSR).

export const usersApi = {
  getAll: () => apiClient<User[]>("/users"),

  getById: (id: number) => apiClient<User>(`/users/${id}`),

  create: (dto: CreateUserDto) =>
    apiClient<User>("/users", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  remove: (id: number) =>
    apiClient<void>(`/users/${id}`, { method: "DELETE" }),
}
