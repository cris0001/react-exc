import {useEffect, useRef, useState} from "react";
import {useDebounce} from "@/lc/rea-se/40/autocmplt-2/use-debounce.ts";
import {useFetch} from "@/lc/rea-se/40/autocmplt-2/use-fetch.ts";

export function Autocomplete2(){

    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(true)
    const [selected, setSelected] = useState<Array<string>>([])


    const [highlightedId, setHighlightedId] = useState(0)

    const debounced = useDebounce(search,666)
    const isDebouncing = search !== debounced

    const {data,loading, error,fetchedQuery} = useFetch(debounced)

    const itemRefs = useRef<Array<HTMLLIElement | null>>([])
    const ulRef = useRef<HTMLDivElement>(null)


    const showEmpty = isOpen && !loading && !isDebouncing && !error && data.length === 0 && debounced !== '' && fetchedQuery === debounced
    const showData = isOpen && !loading && !error && data.length > 0


    const handleSelect = (el:string)=>{

        setSelected((prev)=> prev.includes(el) ? prev.filter(item => item !==el): [...prev,el])


    }
    useEffect(() => {
        itemRefs.current[highlightedId]?.scrollIntoView({ block: 'nearest' })
    }, [highlightedId])

    useEffect(() => {
        const clickOutside = (e:MouseEvent)=>{
            const el = ulRef.current
            if(el && !el.contains(e.target as Node)) setIsOpen(false)
        }

        window.addEventListener('mousedown',clickOutside)
        return ()=> window.removeEventListener('mousedown',clickOutside)
    }, []);

    const highlight = (text: string, query: string) => {
        const idx = text.toLowerCase().indexOf(query.toLowerCase())
        if (idx === -1) return text
        return (
            <>
                {text.slice(0, idx)}
                <b>{text.slice(idx, idx + query.length)}</b>
                {text.slice(idx + query.length)}
            </>
        )
    }


    return(
        <div ref={ulRef} className={'flex flex-col p-8'}>
            <input
                role='combobox'
                aria-expanded={showData}
                aria-controls="autocomplete-list"
                aria-activedescendant={showData ? `option-${highlightedId}` : undefined}   // ← która opcja aktywna
                onKeyDown={(e)=>{
                if(e.key === 'ArrowDown') {
                    e.preventDefault()
                    setHighlightedId((p)=>{
                        if(p === data.length-1) return 0
                        return Math.min(p+1,data.length-1)
                    })
                }
                if(e.key === 'ArrowUp') {
                    e.preventDefault()
                    setHighlightedId((p)=> {
                        if(p === 0) return data.length - 1
                            return Math.max(p-1,0)
                    })
                }
                if(e.key === 'Enter') {
                    e.preventDefault()
                    handleSelect(data[highlightedId])
                }
            }} className={'border border-gray-200 px-4 rounded'} value={search} onChange={(e)=> {
                setSearch(e.target.value)
                setIsOpen(true)
                setHighlightedId(0)
            }} />

            {loading && isOpen &&  <span>loading</span>}
            {error && !loading && isOpen && <span className={'text-red-300'} >{error}</span>}
            {showEmpty && <span>brak danych</span>}
            {showData && <ul id="autocomplete-list" role="listbox" className={'h-[233px] overflow-y-auto'}>
                {data.map((el,index)=>
                    <li
                        role="option"
                        aria-selected={highlightedId === index}
                        id={`option-${index}`}

                        onMouseEnter={() => setHighlightedId(index)}
                        ref={(node) => {
                            itemRefs.current[index] = node
                        }}
                        onClick={() => handleSelect(el)}
                        className={` ${highlightedId === index ? 'bg-blue-100' : 'bg-gray-50'} flex justify-between border-gray-200 px-2  mb-0.5 border rounded py-1.5`}
                        key={el}>

                        <span> {highlight(el, debounced)}</span>
                        <input type={'checkbox'} checked={selected.includes(el)}/>
                    </li>)}
            </ul>}

            {selected.length > 0 && <div className={'flex flex-wrap gap-2'} >{selected.map((el)=> <button key={el} onClick={()=> setSelected((prev)=> prev.filter(item => el!==item))} className={'rounded-full border border-blue-300 bg-blue-200 px-4'}>
                {el} x
            </button>)}</div>}
        </div>
    )
}