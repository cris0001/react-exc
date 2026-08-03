import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "../api/usersApi"
import { userKeys } from "../api/queryKeys"
import type { CreateUserDto, User } from "../types/user"

// MUTATION = zmiana danych (POST/PUT/DELETE).
// Kluczowa różnica vs query: NIE odpala się sama — wołasz mutate() ręcznie.

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateUserDto) => usersApi.create(dto),

    // po sukcesie: unieważnij listę -> TanStack Query sam ją przeładuje
    onSuccess: (newUser: User) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })

      // Alternatywa (bez refetchu) — ręcznie dopisz do cache:
      // queryClient.setQueryData<User[]>(userKeys.lists(), (old) =>
      //   old ? [...old, newUser] : [newUser]
      // )
    },

    onError: (error) => {
      console.error("Nie udało się utworzyć użytkownika:", error)
    },
  })

  // Zwraca m.in.: mutate, mutateAsync, isPending, isError, error, isSuccess
}
