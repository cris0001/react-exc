import {useState} from "react";
import {useFetch} from "./useFetch";

type User = {
    id: number
    first_name: string
    last_name: string
    email: string
}

type UsersResponse = {
    data: User[]
    page: number
    total: number
    total_pages: number
}


export default function UsersList() {

    const [page, setPage] = useState(1)
    const {data, loading, error} = useFetch<UsersResponse>(`https://reqres.in/api/users?page=${page}&per_page=2`, true)


    return (
        <>
            <p>list</p>

            {error && <span className="text-red-400">{error}</span>}


            <ul>
                {data?.data.map((user) => (
                    <li key={user.id}>{user.first_name} {user.last_name} — {user.email}</li>
                ))}
            </ul>

            {loading &&
                <span>updating…</span>}
            {!error && <>
                <div className="flex gap-2">
                    <button
                        disabled={page === 1 || loading}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </button>
                    <button
                        disabled={page === data?.total_pages || loading}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>

                <strong>page {page} of {data?.total_pages ?? "…"}</strong></>}
        </>
    )
}