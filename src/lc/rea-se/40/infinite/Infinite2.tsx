import { useEffect, useRef, useState } from "react";

type Post = {
    id: number,
    userId: number,
    title: string,
    body: string
}

export function Infinite() {
    const [items, setItems] = useState<Post[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const sentinelRef = useRef<HTMLDivElement>(null)
    const loadingRef = useRef(false)   // guard na równoległe wywołania

    const loadMore = async () => {
        if (loadingRef.current || !hasMore) return

        try {
            loadingRef.current = true
            setLoading(true)
            setError('')

            const url = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
            const res = await fetch(url)
            if (!res.ok) throw new Error('blad')
            const json: Post[] = await res.json()

            setItems((prev) => [...prev, ...json])
            setPage((p) => p + 1)
            if (json.length < 10) setHasMore(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'error')
        } finally {
            setLoading(false)
            loadingRef.current = false
        }
    }

    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) loadMore()
        })
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [items.length, hasMore])   // re-twórz observer po każdej porcji → świeży loadMore

    return (
        <div>
            <p>załadowano: {items.length}</p>

            <ul>
                {items.map((post) => (
                    <li key={post.id} className="border border-gray-300 rounded p-2 mb-2">
                        <b>{post.title}</b>
                        <p>{post.body}</p>
                    </li>
                ))}
            </ul>

            {loading && <p>ładowanie...</p>}
            {error && <p>{error}</p>}
            {!hasMore && <p>to już wszystko</p>}

            <div ref={sentinelRef} style={{ height: '20px' }} />
        </div>
    )
}