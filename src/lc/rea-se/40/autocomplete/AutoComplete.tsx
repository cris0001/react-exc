import {useEffect, useRef, useState} from "react";
import {useDebounce} from "@/lc/rea-se/40/autocomplete/use-debounce.ts";


type User = {
    userId: number,
    id: number,
    title: string,
    body: string
}

export function AutoComplete() {

    const [search, setSearch] = useState('')
    const [data, setData] = useState<Array<User>>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<User[]>([])

    const [history, setHistory] = useState<User[]>(() => {
        try {
            const stored = window.localStorage.getItem('history')
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    })

    const htmlRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<Array<HTMLLIElement | null>>([])

    const cache = useRef(new Map<string, User[]>())
    const debouncedSearch = useDebounce(search, 400)


    // ─── FETCH + CACHE ───
    useEffect(() => {
        if (!debouncedSearch) {
            setOpen(false)
            setData([])
            setActiveIndex(-1)
            setError('')
            return
        }

        if (cache.current.has(debouncedSearch)) {
            setData(cache.current.get(debouncedSearch)!)
            setActiveIndex(-1)
            setOpen(true)
            return
        }

        const controller = new AbortController()
        const fetchData = async () => {
            try {
                setLoading(true)
                setError('')
                const res = await fetch(
                    `https://jsonplaceholder.typicode.com/posts?title_like=${debouncedSearch}`,
                    {signal: controller.signal}
                )
                if (!res.ok) throw new Error(`http error ${res.status}`)
                const json = await res.json()
                cache.current.set(debouncedSearch, json)
                setData(json)
                setActiveIndex(-1)
                setOpen(true)
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') return
                setError(err instanceof Error ? err.message : 'error')
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        fetchData()
        return () => controller.abort()
    }, [debouncedSearch])


    // ─── CLICK OUTSIDE ───
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const el = htmlRef.current
            if (el && !el.contains(e.target as Node)) setOpen(false)
        }
        window.addEventListener('mousedown', handleClickOutside)
        return () => window.removeEventListener('mousedown', handleClickOutside)
    }, [])


    // ─── ZAPIS HISTORII DO localStorage ───
    useEffect(() => {
        localStorage.setItem('history', JSON.stringify(history))
    }, [history])


    // ─── SCROLL DO PODŚWIETLONEJ OPCJI ───
    useEffect(() => {
        if (activeIndex < 0) return
        itemRefs.current[activeIndex]?.scrollIntoView({block: 'nearest'})
    }, [activeIndex])


    // ─── WYBÓR ELEMENTU (Enter + klik) ───
    const selectItem = (item: User) => {
        setSelected((p) => p.some(el => el.id === item.id) ? p : [...p, item])
        setHistory((p) => {
            const withoutDup = p.filter(el => el.id !== item.id)
            return [item, ...withoutDup].slice(0, 5)
        })
    }


    // ─── KLAWIATURA ───
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open || data.length === 0) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex(i => (i < data.length - 1 ? i + 1 : 0))
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex(i => (i > 0 ? i - 1 : data.length - 1))
        }
        if (e.key === 'Escape') {
            e.preventDefault()
            setOpen(false)
        }
        if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault()
            selectItem(data[activeIndex])
        }
    }


    // ─── HIGHLIGHT PASUJĄCEGO FRAGMENTU ───
    const highlight = (text: string, query: string) => {
        const idx = text.toLowerCase().indexOf(query.toLowerCase())
        if (idx === -1) return text
        return <>{text.slice(0, idx)}<b>{text.slice(idx, idx + query.length)}</b>{text.slice(idx + query.length)}</>
    }


    return (
        <div className={'w-[332px] relative'} ref={htmlRef}>

            {/* CHIPY WYBRANYCH */}
            {selected.length > 0 && (
                <div className={'flex gap-2 flex-wrap'}>
                    {selected.map(el => (
                        <button
                            onClick={() => setSelected((p) => p.filter((usr) => el.id !== usr.id))}
                            className={'border rounded border-blue-300'}
                            key={el.id}
                        >
                            {el.title.slice(0, 10)}
                        </button>
                    ))}
                </div>
            )}

            {/* INPUT */}
            <input
                onKeyDown={handleKeyDown}
                onFocus={() => setOpen(true)}
                className={'border border-gray-400 rounded'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {loading && <p>loading</p>}
            {!loading && error && <p>{error}</p>}

            {/* HISTORIA — gdy input pusty i otwarte */}
            {!loading && !error && !debouncedSearch && open && history.length > 0 && (
                <ul className="max-h-[240px] overflow-y-auto border border-gray-400">
                    <li className="text-xs text-gray-400 px-2 py-1">Ostatnie</li>
                    {history.map((el) => (
                        <li
                            key={el.id}
                            onClick={() => selectItem(el)}
                            className="cursor-pointer hover:bg-gray-100 px-2"
                        >
                            {el.title.slice(0, 30)}
                        </li>
                    ))}
                </ul>
            )}

            {/* NO DATA */}
            {!loading && !error && debouncedSearch && data.length === 0 && <p>no data</p>}

            {/* WYNIKI */}
            {!loading && !error && data.length > 0 && open && (
                <ul className="max-h-[240px] overflow-y-auto border border-gray-400">
                    {data.map((el, i) => (
                        <li
                            ref={(node) => { itemRefs.current[i] = node }}
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => selectItem(el)}
                            className={i === activeIndex ? 'bg-blue-100' : ''}
                            key={el.id}
                        >
                            {highlight(el.title, debouncedSearch)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}