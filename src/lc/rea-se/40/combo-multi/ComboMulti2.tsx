import { useEffect, useRef, useState } from "react";

type Option = { id: number; label: string; group: string }

const options: Option[] = [
    { id: 1, label: 'JavaScript', group: 'Frontend' },
    { id: 2, label: 'React', group: 'Frontend' },
    { id: 3, label: 'Node.js', group: 'Backend' },
    { id: 4, label: 'PostgreSQL', group: 'Backend' },
    { id: 5, label: 'Docker', group: 'DevOps' },
]

export function ComboMulti2() {

    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<Option[]>([])
    const [highlighted, setHighlighted] = useState(-1)

    const wrapperRef = useRef<HTMLDivElement>(null)
    const highlightedRef = useRef<HTMLLIElement>(null)

    useEffect(() => {
        highlightedRef.current?.scrollIntoView({ block: 'nearest' })
    }, [highlighted])

    const toggleSelect = (item: Option) => {
        setSelected((p) => {
            const exist = p.some((el) => el.id === item.id)
            return exist
                ? p.filter((el) => el.id !== item.id)
                : [...p, item]
        })
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const el = wrapperRef.current
            if (el && !el.contains(e.target as Node)) {
                setOpen(false)
                setHighlighted(-1)
            }
        }
        window.addEventListener('mousedown', handleClickOutside)
        return () => window.removeEventListener('mousedown', handleClickOutside)
    }, []);

    // filtered = PŁASKA lista (bez zaznaczonych, po search) — po niej nawiguje highlighted
    const filtered = search.trim()
        ? options
            .filter((el) => !selected.some((s) => el.id === s.id))
            .filter((el) => el.label.toLowerCase().includes(search.toLowerCase()))
        : options.filter((el) => !selected.some((s) => el.id === s.id))

    // grouped = obiekt grupa -> opcje (do renderu grupowego)
    const grouped = filtered.reduce((acc, opt) => {
        (acc[opt.group] ??= []).push(opt)
        return acc
    }, {} as Record<string, Option[]>)



    return (
        <div ref={wrapperRef} className={'w-[300px] flex flex-col'}>
            {selected.length > 0 && <div className={'flex gap-2 flex-wrap'}>
                {selected.map((el) => <button className={'rounded-full bg-blue-200 px-2'} key={el.id} onClick={() => toggleSelect(el)}>{el.label} x</button>)}
            </div>}

            <input
                onKeyDown={(e) => {
                    if(e.key === 'ArrowDown') {
                        e.preventDefault()
                        setHighlighted((p)=> Math.min(p+1, filtered.length-1))
                    }
                    if(e.key ==='ArrowUp') {
                        e.preventDefault()
                        setHighlighted((p)=> Math.max(p - 1 , 0 ))
                    }
                    if (e.key === 'Enter' && highlighted >= 0 && filtered[highlighted]) {
                        e.preventDefault()
                        toggleSelect(filtered[highlighted])
                    }
                    if (e.key === 'Escape') {
                        e.preventDefault()
                        setOpen(false)
                    }
                    if (e.key === 'Backspace' && !search && selected.length > 0) {
                        toggleSelect(selected[selected.length - 1])
                    }
                }}
                aria-expanded={open}
                role="combobox"
                onFocus={() => setOpen(true)}
                className={'border border-gray-200 px-2 rounded'}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                    setHighlighted(-1)
                }} />

            {open && <ul role="listbox" aria-multiselectable className={'h-[222px] overflow-y-auto'}>
                {(() => {
                    // licznik globalnego indeksu — mapuje pozycję opcji w PŁASKIEJ liście (filtered)
                    // na render grupowy, żeby highlighted (indeks w filtered) podświetlał właściwą opcję
                    let flatIndex = -1
                    return Object.entries(grouped).map(([group, opts]) => (
                        <li key={group} role="group" aria-label={group}>
                            <div className={'px-2 py-1 text-xs font-bold text-gray-500 bg-gray-50'}>{group}</div>
                            <ul>
                                {opts.map((opt) => {
                                    flatIndex++
                                    const currentIndex = flatIndex
                                    return (
                                        <li
                                            ref={highlighted === currentIndex ? highlightedRef : null}
                                            onMouseEnter={() => setHighlighted(currentIndex)}
                                            className={`border border-gray-100 px-2 py-1 ${highlighted === currentIndex ? 'bg-gray-100' : ''}`}
                                            role="option"
                                            aria-selected={selected.some((s) => s.id === opt.id)}
                                            key={opt.id}
                                            onClick={() => toggleSelect(opt)}
                                        >
                                            {opt.label}
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    ))
                })()}



                {filtered.length === 0 && <li className="px-2 py-1 border border-gray-100 text-gray-400">Brak wyników</li>}
            </ul>}

        </div>
    )
}