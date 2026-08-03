import { useState } from "react"
import { useCreateUser } from "../hooks/useCreateUser"

// Mutacja w praktyce: mutate() + isPending + isError.
// (Prawdziwy formularz zrobiłbyś w React Hook Form — patrz katalog forms/)

export function CreateUserForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const createUser = useCreateUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createUser.mutate(
      { name, email },
      {
        // callbacki per-wywołanie (obok tych globalnych w hooku)
        onSuccess: () => {
          setName("")
          setEmail("")
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Imię" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />

      {/* isPending -> zablokuj przycisk (ochrona przed double submit) */}
      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? "Zapisuję..." : "Dodaj"}
      </button>

      {createUser.isError && <p>Błąd: {createUser.error.message}</p>}
    </form>
  )
}
