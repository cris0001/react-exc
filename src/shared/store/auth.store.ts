import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthUser } from "@/types"

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean

  // Zapisuje usera po zalogowaniu
  setUser: (user: AuthUser) => void

  // Czyści sesję przy wylogowaniu
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  // persist - trzyma stan w sessionStorage (nie localStorage)
  // sessionStorage ginie po zamknięciu karty - lepsze dla danych auth
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      logout: () => {
        // Czyścimy cookie sesji (symulowane httpOnly)
        document.cookie = "session=; path=/; max-age=0"
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
      storage: {
        // sessionStorage zamiast domyślnego localStorage
        getItem: (key) => {
          const item = sessionStorage.getItem(key)
          return item ? JSON.parse(item) : null
        },
        setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    }
  )
)
