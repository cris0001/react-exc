import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "../api/usersApi"
import { userKeys } from "../api/queryKeys"
import type { User } from "../types/user"

// Mutacja z OPTIMISTIC UPDATE — UI reaguje natychmiast, rollback przy błędzie.

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usersApi.remove(id),

    // 1. PRZED requestem — zmień cache optymistycznie
    onMutate: async (id: number) => {
      // zatrzymaj trwające refetche, żeby nie nadpisały naszej zmiany
      await queryClient.cancelQueries({ queryKey: userKeys.lists() })

      // zapamiętaj poprzedni stan (do rollbacku)
      const previous = queryClient.getQueryData<User[]>(userKeys.lists())

      // usuń usera z cache OD RAZU (user widzi efekt natychmiast)
      queryClient.setQueryData<User[]>(userKeys.lists(), (old) =>
        old?.filter((u) => u.id !== id)
      )

      return { previous } // trafi do context w onError
    },

    // 2. BŁĄD -> cofnij zmianę
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(userKeys.lists(), context.previous)
      }
    },

    // 3. ZAWSZE na koniec -> zsynchronizuj z serwerem
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
