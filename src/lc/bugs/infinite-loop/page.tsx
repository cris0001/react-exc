'use client'

// Komponent pobiera posty użytkownika i pozwala filtrować po tytule. Ale zapętla się w nieskończoność — request leci setki razy, przeglądarka przymula
// Znajdź przyczynę pętli. Są też dwa inne problemy (nie powodujące pętli, ale warte poprawy). 👀
import { useState, useEffect } from "react"

type Post = { id: number; title: string }

function UserPosts({ userId }: { userId: number }) {
    const [posts, setPosts] = useState<Post[]>([])
    const [search, setSearch] = useState("")

    const options = {
        headers: { "Content-Type": "application/json" },
    }

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`, options)
            .then((res) => res.json())
            .then((data) => setPosts(data)) // race codnifitons
    }, [userId, options]) // options niestabilne trigeruje sie co rerender

    const filtered = posts.filter((p) => p.title.includes(search))

    return (
        <div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} />
            <ul>
                {filtered.map((p, i) => (
                    <li key={i}>{p.title}</li>
                ))}
            </ul>
        </div>
    )
}