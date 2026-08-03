// Typy domenowe — kształt danych z API.
// Osobno, bo używa ich api/, hooks/ i components/.

export type User = {
  id: number
  name: string
  email: string
}

// DTO = dane wysyłane do API przy tworzeniu (bez id — nadaje je serwer)
export type CreateUserDto = {
  name: string
  email: string
}
