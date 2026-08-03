import {useEffect, useState} from "react";

export function useFetch<T>(url: string) {
    const [data, setData] = useState<T>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")


    useEffect(() => {
        if (!url) return
        const controller = new AbortController()

        const fetchData = async () => {

            setLoading(true)
            setError('')
            setData(undefined)
            try {

                const res = await fetch(`${url}`, {signal: controller.signal})
                if (!res.ok) throw new Error(`Http ${res.status}`)

                const json = await res.json()
                setData(json)
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') return
                setError(err instanceof Error ? err.message : "Coś poszło nie tak")
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        fetchData()
        return () => controller.abort()

    }, [url]);

    return {data, loading, error}

}