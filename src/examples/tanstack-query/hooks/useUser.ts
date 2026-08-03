import { useQuery } from "@tanstack/react-query"
import { usersApi } from "../api/usersApi"
import { userKeys } from "../api/queryKeys"

// Query z parametrem + warunkowe uruchomienie (enabled).

export function useUser(id: number | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id!),        // id jest częścią klucza -> osobny cache per user
    queryFn: () => usersApi.getById(id!),

    // enabled: false -> query się NIE odpali (np. dopóki nie znamy id).
    // To zastępuje "if (!id) return" w useEffect.
    enabled: id !== undefined,
  })
}
