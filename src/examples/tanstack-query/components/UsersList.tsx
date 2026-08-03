import { useUsers } from "../hooks/useUsers"
import { useDeleteUser } from "../hooks/useDeleteUser"

// Komponent NIE wie o fetchu, cache ani kluczach — tylko konsumuje hooki.
// To jest cała pointa: logika danych w hooks/, UI w components/.

export function UsersList() {
  const { data: users, isPending, isError, error, isFetching } = useUsers()
  const deleteUser = useDeleteUser()

  // isPending = pierwsze ładowanie (brak danych)
  if (isPending) return <p>Ładowanie...</p>

  if (isError) return <p>Błąd: {error.message}</p>

  return (
    <div>
      {/* isFetching = refetch w tle (dane już są) -> subtelny wskaźnik */}
      {isFetching && <span>Odświeżam...</span>}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} — {user.email}
            <button
              onClick={() => deleteUser.mutate(user.id)}
              disabled={deleteUser.isPending}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
