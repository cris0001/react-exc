import { useCallback, useEffect, useRef, useState } from "react";
import {useInfiniteScroll} from "@/lc/rea-se/40/infinite/useInfiniteScroll.ts";

type Post = {
    id: number,
    userId: number,
    title: string,
    body: string
}

const LIMIT = 10

const fetchPosts = async (page: number): Promise<Post[]> => {
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${LIMIT}`
    )
    if (!res.ok) throw new Error('blad')
    return res.json()
}

export function Infinite() {
    // const [items, setItems] = useState<Post[]>([])
    // const [loading, setLoading] = useState(false)
    // const [error, setError] = useState('')
    // const [page, setPage] = useState(1)
    // const [hasMore, setHasMore] = useState(true)

    // // refy — świeże wartości dla stabilnego loadMore (bez stale closure)
    // const loadingRef = useRef(false)
    // const pageRef = useRef(1)
    // const hasMoreRef = useRef(true)



    // const sentinelRef = useRef<HTMLDivElement>(null)
    //
    // const loadMore = useCallback(async () => {
    //     if (loadingRef.current || !hasMoreRef.current) return
    //
    //     try {
    //         loadingRef.current = true
    //         setLoading(true)
    //         setError('')
    //
    //         const url = `https://jsonplaceholder.typicode.com/posts?_page=${pageRef.current}&_limit=10`
    //         const res = await fetch(url)
    //         if (!res.ok) throw new Error('blad')
    //         const json: Post[] = await res.json()
    //
    //         setItems((prev) => [...prev, ...json])
    //
    //         pageRef.current += 1
    //         setPage(pageRef.current)
    //
    //         if (json.length < 10) {
    //             hasMoreRef.current = false
    //             setHasMore(false)
    //         }
    //     } catch (err) {
    //         setError(err instanceof Error ? err.message : 'error')
    //     } finally {
    //         setLoading(false)
    //         loadingRef.current = false
    //     }
    // }, [])   // stabilny — wszystko z refów/updaterów, nic z closure
    //
    // // observer — loadMore stabilny, więc efekt podpina się raz i zawsze woła świeży loadMore
    // useEffect(() => {
    //     const sentinel = sentinelRef.current
    //     if (!sentinel) return
    //
    //     const observer = new IntersectionObserver((entries) => {
    //         if (entries[0].isIntersecting) loadMore()
    //     })
    //     observer.observe(sentinel)
    //     return () => observer.disconnect()
    // }, [loadMore, hasMore])
    //
    // // pierwsze ładowanie
    // useEffect(() => {
    //     loadMore()
    // }, [loadMore])

    const { items, loading, error, hasMore, sentinelRef } =
        useInfiniteScroll<Post>(fetchPosts, LIMIT)

    return (
        <div className={'bg-red-50'}>
            <div className={'h-[444px] bg-gray-100 overflow-y-auto mt-10'}>
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

                {hasMore && <div ref={sentinelRef} style={{height: '20px'}}/>}
            </div>
        </div>
    )
}