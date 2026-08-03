import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dane są "świeże" przez 60s - nie refetchuje przy każdym focus okna
      staleTime: 60_000,

      // Trzyma dane w cache przez 5 minut po odmontowaniu komponentu
      gcTime: 5 * 60_000,

      // Nie retry przy 401/403/404 - to nie są błędy sieciowe
      retry: (failureCount, error: any) => {
        const status = error?.response?.status
        if (status === 401 || status === 403 || status === 404) return false
        return failureCount < 2
      },

      // Refetch przy powrocie do okna wyłączony - aplikacja HR nie wymaga
      // real-time danych co kilka sekund
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Mutacje nie retry - zapobiega podwójnemu zapisowi
      retry: false,
    },
  },
})
