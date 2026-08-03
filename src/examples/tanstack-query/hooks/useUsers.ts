import { useQuery } from "@tanstack/react-query"
import { usersApi } from "../api/usersApi"
import { userKeys } from "../api/queryKeys"

// QUERY = odczyt danych (GET). Cache'owane, dedupowane, auto-refetch.
//
// Komponent NIE woła usersApi bezpośrednio — woła TEN hook.
// Dzięki temu logika cache/kluczy jest w jednym miejscu.

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),  // identyfikator w cache
    queryFn: usersApi.getAll,    // funkcja pobierająca (musi rzucać przy błędzie!)
  })

  // Zwraca m.in.:
  //   data, isPending, isError, error, isFetching, refetch
  //
  // isPending  — pierwsze ładowanie (nie ma jeszcze danych)
  // isFetching — JAKIKOLWIEK fetch w tle (także refetch przy istniejących danych)
}
