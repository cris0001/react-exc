import {useEffect, useState} from "react";

export function useFetch<T>(url: string, keepPreviousData = false) {
    const [data, setData] = useState<T>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async () => {
            setLoading(true)
            setError("")
            if (!keepPreviousData) {
                setData(undefined)   // clear old data → shows nothing while loading
            }
            // if keepPreviousData: we DON'T clear → old data stays visible
            try {
                const res = await fetch(url, {
                    signal: controller.signal,
                    headers: {"x-api-key": "free_user_3GoPaEHhceKpGueRHerN9W8yBLf"}
                })
                if (!res.ok) throw new Error(`Http ${res.status}`)
                const json = await res.json()
                setData(json)   // replace with new when it arrives
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return
                setError(err instanceof Error ? err.message : "Coś poszło nie tak")
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        fetchData()
        return () => controller.abort()
    }, [url, keepPreviousData])

    return {data, loading, error}
}