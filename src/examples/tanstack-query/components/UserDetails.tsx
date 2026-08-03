import { useUser } from "../hooks/useUser"

// Query z parametrem. Zwróć uwagę: gdy id jest undefined,
// hook ma enabled:false -> zapytanie się NIE odpala.

export function UserDetails({ userId }: { userId: number | undefined }) {
  const { data: user, isPending, isError, error } = useUser(userId)

  if (!userId) return <p>Wybierz użytkownika</p>
  if (isPending) return <p>Ładowanie...</p>
  if (isError) return <p>Błąd: {error.message}</p>

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}
