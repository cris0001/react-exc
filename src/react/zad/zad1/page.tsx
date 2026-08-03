"use client"


import React, {useDeferredValue, useEffect, useMemo, useState} from "react";
import {useVirtualizer} from "@tanstack/react-virtual";

type Photo = {
    albumId: number
    id: number
    title: string
    url: string
    thumbnailUrl: string
}


// url https://jsonplaceholder.typicode.com/photos

function useFetch<T>(url: string) {

    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        const controller = new AbortController()

        const fetchData = async () => {
            try {
                setLoading(true)
                setError('')

                const res = await fetch(url, {signal: controller.signal})
                if (!res.ok) throw new Error(`HTTP ${res.status}`)

                const data = await res.json()
                setData(data)

            } catch (err) {

                if (err instanceof Error && err.name === 'AbortError') return
                setError(err instanceof Error ? err.message : 'Nieznany błąd')

            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }

        }

        fetchData()

        return () => controller.abort()

    }, [url]);

    return {data, error, loading}

}


export default function RootPage() {

    const parentRef = React.useRef<HTMLDivElement | null>(null)
    const {data, error, loading} = useFetch<Photo[]>('https://jsonplaceholder.typicode.com/photos')
    const [search, setSearch] = useState('')
    const deferredSearch = useDeferredValue(search)


    const filtered = useMemo(() => {
        console.time('filter')
        const result = data?.filter(u =>
            u.title.toLowerCase().includes(deferredSearch.toLowerCase())
        )
        console.timeEnd('filter')   // pokaże ile ms trwał filtr
        return result
    }, [data, deferredSearch])

    const rowVirtualizer = useVirtualizer({
        count: filtered?.length ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
        overscan: 5,
    })


    if (loading) return <p>Ładowanie...</p>
    if (error) return <p>Błąd: {error}</p>
    if (!data) return null


    return (
        <div className={'flex flex-col gap-4'}>

            <input value={search} onChange={(e) => setSearch(e.target.value)}
                   className={'border border-gray-300 p-2 w-64'}/>

            <div ref={parentRef} style={{height: 900, overflow: "auto"}}>

                <div style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}>
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const photo = filtered![virtualItem.index]   // ← dostań zdjęcie po indexie
                        return (
                            <div
                                key={virtualItem.key}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: virtualItem.size,
                                    transform: `translateY(${virtualItem.start}px)`,   // ← pozycja
                                }}
                                className="flex gap-2 items-center"
                            >
                                <img src={photo.thumbnailUrl} width={50} height={50} alt=""/>
                                {photo.title}
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}