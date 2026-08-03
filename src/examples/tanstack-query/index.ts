// Barrel — publiczne API tego "feature'a".
// Reszta aplikacji importuje TYLKO stąd, nie z wnętrza katalogów.

export { QueryProvider } from "./QueryProvider"
export { queryClient } from "./queryClient"

export { useUsers } from "./hooks/useUsers"
export { useUser } from "./hooks/useUser"
export { useCreateUser } from "./hooks/useCreateUser"
export { useDeleteUser } from "./hooks/useDeleteUser"

export { UsersList } from "./components/UsersList"
export { UserDetails } from "./components/UserDetails"
export { CreateUserForm } from "./components/CreateUserForm"

export type { User, CreateUserDto } from "./types/user"
