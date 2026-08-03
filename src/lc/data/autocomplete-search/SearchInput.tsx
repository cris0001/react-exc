import {RefObject, useEffect, useRef, useState} from "react";
import {useDebounce} from "./useDebounce";
import {useFetch} from "./useFetch";


type SearchItem = {
    userId: number,
    id: number,
    title: string,
    body: string
}

export function SearchInput() {

    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 400)
    const [open, setOpen] = useState(false)

    const ref = useRef<HTMLUListElement>(null)

    const url = debouncedSearch ? `https://jsonplaceholder.typicode.com/posts?title_like=${debouncedSearch}` : ''
    const isPending = search !== debouncedSearch

    const {data, loading, error} = useFetch<SearchItem[]>(url)
    useEffect(() => {
        if (search === '') setOpen(false)
    }, [search]);


    const showLoading = (loading || isPending)

    const handleSelect = (title: string) => {
        setSearch(title)
        setOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)


    }, []);


    return (
        <div className="relative w-80">
            <input
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                    setOpen(e.target.value !== "")
                }}
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 p-2 rounded"
            />

            {/*{data?.map((el) =>*/}
            {/*    <li key={el.id} className="p-2 hover:bg-gray-100 cursor-pointer">{el.title}</li>)}*/}

            {open && (
                <ul ref={ref}
                    className="absolute w-full border border-gray-300 rounded mt-1 bg-white max-h-[300px] overflow-y-auto">
                    {showLoading && <li className="p-2 text-gray-400">loading</li>}
                    {!showLoading && error &&
                        <li className="p-2 text-red-400">{error}</li>} {data && data.length === 0 && !showLoading &&
                    <li className="p-2 text-gray-400">No matches</li>}
                    {!showLoading && data?.map((el) => (
                        <li
                            key={el.id}
                            onClick={() => handleSelect(el.title)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {el.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}