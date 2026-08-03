import {useState, useEffect} from "react"


function useDebounce<T>(value: T, ms: number): T {

    const [debounced, setDebounced] = useState(value)

    useEffect(() => {


        const timer = setTimeout(() => {
            setDebounced(value)
        }, ms)

        return () => clearTimeout(timer)

    }, [value, ms]);

    return debounced

}


function Search() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const debounced = useDebounce(query, 300)


    useEffect(() => {

        if (!debounced) {
            setResults([])
            return
        }

        const controller = new AbortController()
        const fetchData = async () => {

            try {
                setLoading(true)
                setError('')
                const res = await fetch(`/api/search?q=${encodeURIComponent(debounced)}`, {signal: controller.signal})

                if (!res.ok) throw new Error(`http ${res.status}`)
                const data = await res.json()
                setResults(data)


            } catch (err: unknown) {
                if (err instanceof Error && err.name === 'AbortError') return
                if (err instanceof Error) setError(err.message)
                else setError('unknown error')


            } finally {
                if (!controller.signal.aborted) setLoading(false)

            }

        }
        fetchData()

        return () => controller.abort()

    }, [debounced])

    return (
        <>
            <input value={query} onChange={(e) => setQuery(e.target.value)}/>

            {loading && <strong>loading</strong>}
            {error && <strong>{error}</strong>}
            {!error && <ul>
                {results.map((r) => (
                    <li key={r}>{r}</li>
                ))}
            </ul>}
        </>
    )
}