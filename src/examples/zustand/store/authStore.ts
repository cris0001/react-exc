import { create } from "zustand"
import { persist } from "zustand/middleware"

// MIDDLEWARE persist -> stan sam zapisuje się do localStorage
// i wczytuje przy starcie aplikacji. Zero useEffect.

type User = {
  id: number
  email: string
}

type AuthState = {
  user: User | null
  token: string | null

  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage", // klucz w localStorage

      // zapisuj TYLKO wybrane pola (nie funkcje!)
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

// Uwaga SSR (Next.js): persist czyta localStorage -> hydration mismatch.
// Rozwiązanie: flaga `mounted` w komponencie albo skipHydration + rehydrate w useEffect.
