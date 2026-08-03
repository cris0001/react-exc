import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ReactNode } from "react"
import { queryClient } from "./queryClient"

// Owija CAŁĄ aplikację (w main.tsx). Bez tego hooki useQuery rzucą błąd.

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools — panel do podglądu cache. Tylko w dev, sam się wycina z prod buildu */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
