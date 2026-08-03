import {useState, useEffect} from "react"

type User = { id: number; name: string; email: string }

function UserProfile({userId}: { userId: number }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        // race condifiton + state update after unmount

        const controller = new AbortController()
        setLoading(true)
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((data) => {
                setUser(data)
                setLoading(false)
            })
            .catch((err) => {
                if (err.name === "AbortError") return   // anulowany — ignoruj
                setLoading(false)                        // prawdziwy błąd — przestań ładować
            })

        return () => controller.abort()
    }, [userId])

    if (loading) return <p>Ładowanie...</p>

    //guard
    if (!user) return <p>Brak danych</p>
    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    )
}