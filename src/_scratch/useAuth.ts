"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import type { LoginCredentials, AuthUser, Authority } from "@/types"

const ALLOWED_ROLES = ["ROLE_CLIENT", "ROLE_ADMIN", "ROLE_SUPERADMIN"] as const

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUser, logout: storeLogout } = useAuthStore()
  const router = useRouter()

  const login = async ({ email, password }: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      // ---------------------------------------------------------------------------
      // Budujemy token Basic Auth z danych formularza.
      // btoa() to wbudowana funkcja przeglądarki - odpowiednik Buffer.from().toString('base64')
      // Token jest generowany lokalnie i nigdy nie jest wysyłany jako query param ani prop.
      // ---------------------------------------------------------------------------
      const basicToken = btoa(`${email}:${password}`)

      // Wywołanie backendu - Spring zwraca dane zalogowanego usera
      const res = await fetch(`/proxy/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
        signal: AbortSignal.timeout(10_000),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message ?? "Logowanie nie powiodło się.")
      }

      const data = await res.json()

      // Walidacja ról przed zapisaniem sesji
      const hasRole = (data.authorities as Authority[])?.some((a) =>
        (ALLOWED_ROLES as readonly string[]).includes(a.authority)
      )

      if (!hasRole) {
        throw new Error(`Brak uprawnień. Twoja rola: ${data.authorities?.map((a: Authority) => a.authority).join(", ")}`)
      }

      // Budujemy obiekt usera - token dołączamy do danych z backendu.
      // Token siedzi wyłącznie w Zustand (sessionStorage) - nie trafia do DOM.
      const user: AuthUser = { ...data, token: basicToken }

      // Ustawiamy cookie sesji po stronie klienta.
      // W produkcji zastąpiłby to serwer przez: Set-Cookie: session=...; HttpOnly; Secure
      // Tu symulujemy ten flow - cookie bez HttpOnly ale token i tak jest tylko w sessionStorage
      document.cookie = "session=authenticated; path=/; SameSite=Strict"

      setUser(user)
      router.push("/dashboard")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Logowanie nie powiodło się."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    storeLogout()
    router.push("/login")
  }

  return { login, logout, isLoading, error }
}
