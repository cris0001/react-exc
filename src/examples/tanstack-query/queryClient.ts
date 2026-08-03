import { QueryClient } from "@tanstack/react-query"

// JEDNA instancja klienta na aplikację — trzyma cache wszystkich zapytań.
// Konfiguracja globalna: domyślne zachowanie dla wszystkich queries/mutations.

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // jak długo dane są "świeże" — w tym czasie ZERO refetchu
      staleTime: 1000 * 60 * 5, // 5 min

      // jak długo nieużywane dane siedzą w cache zanim znikną
      gcTime: 1000 * 60 * 10, // 10 min (dawniej cacheTime)

      retry: 1,                     // ile ponowień przy błędzie
      refetchOnWindowFocus: false,  // domyślnie true — często irytujące w dev
    },
    mutations: {
      retry: 0, // mutacji zwykle NIE ponawiamy automatycznie (double submit!)
    },
  },
})
