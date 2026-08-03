import {useEffect, useRef, useState} from "react";
import {useDebounce} from "@/lc/data/autocomplete-debounce/hooks.ts";
import {searchApi} from "@/lc/data/autocomplete-debounce/api.ts";

export function AutoComplete() {
    const [searchValue, setSearchValue] = useState('')
    const [results, setResults] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)

    const debounced = useDebounce(searchValue, 300)
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (searchValue === '') setOpen(false)
    }, [searchValue]);

    const handleSelect = (value: string) => {
        setSearchValue(value)
        setOpen(false)
        setActiveIndex(-1)
    }

    useEffect(() => {
        let ignore = false
        const fetchData = async () => {
            if (!debounced) {
                setResults([])
                return
            }
            try {
                setLoading(true)
                const data = await searchApi(debounced)
                if (!ignore) {
                    setResults(data)
                    setActiveIndex(-1) // reset podswietlenia przy nowych wynikach
                }
            } catch (err) {
                if (!ignore) setResults([])
            } finally {
                if (!ignore) setLoading(false)
            }
        }

        fetchData()
        return () => { ignore = true }
    }, [debounced])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const el = ref.current
            if (el && !el.contains(e.target as Node)) setOpen(false)
        }
        window.addEventListener('mousedown', handleClickOutside)
        return () => window.removeEventListener('mousedown', handleClickOutside)
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open || results.length === 0) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex(i => (i + 1) % results.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex(i => (i - 1 + results.length) % results.length)
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0) {
                e.preventDefault()
                handleSelect(results[activeIndex])
            }
        } else if (e.key === 'Escape') {
            setOpen(false)
            setActiveIndex(-1)
        }
    }

    return (
        <div ref={ref} className={'p-4 border border-gray-200 rounded max-w-sm relative'}>
            <input
                className={'border border-gray-600 w-full px-2 py-1 rounded'}
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value)
                    setOpen(e.target.value !== '')
                }}
                onKeyDown={handleKeyDown}
                placeholder="Szukaj..."
            />

            {open && (
                <ul className="absolute left-4 right-4 mt-1 border border-gray-200 rounded divide-y divide-gray-100 bg-white">
                    {loading && (
                        <li className="px-2 py-1 text-sm text-gray-400">Ladowanie...</li>
                    )}

                    {!loading && results.length === 0 && (
                        <li className="px-2 py-1 text-sm text-gray-400">Brak wynikow</li>
                    )}

                    {!loading && results.map((item, index) => (
                        <li
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(index)}
                            key={item}
                            className={`px-2 py-1 text-sm cursor-pointer ${
                                index === activeIndex ? 'bg-gray-200' : 'hover:bg-gray-100'
                            }`}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}