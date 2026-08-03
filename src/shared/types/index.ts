// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface Authority {
  authority: string
}

export interface AuthUser {
  uzytkId: number
  firma: string
  email: string
  imie: string | null
  nazwisko: string | null
  telefon: string | null
  pesel: string | null
  kraj: string | null
  authorities: Authority[]
  accountNonExpired: boolean
  accountNonLocked: boolean
  credentialsNonExpired: boolean
  enabled: boolean
  // token Basic Auth - trzymamy tylko w Zustand, nigdy nie trafia do DOM
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

// Stronicowana odpowiedź z backendu Spring (Page<T>)
export interface ApiPage<T> {
  content: T[]
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// Generyczny błąd z backendu
export interface ApiError {
  message?: string
  error?: string
  status?: number
}
