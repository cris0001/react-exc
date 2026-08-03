import {useState, useTransition, useDeferredValue, useMemo} from "react"

// ciężki komponent — filtruje dużą listę (symulacja obciążenia)
function HeavyList({query}: { query: string }) {
    const items = useMemo(() => {
        const result = []
        for (let i = 0; i < 20000; i++) {
            if (`item ${i}`.includes(query)) result.push(`item ${i}`)
        }
        return result
    }, [query])

    return (
        <ul>
            {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
    )
}

// ============================================================
// WERSJA A — useTransition
// oznaczasz SAMĄ AKTUALIZACJĘ (setState) jako niepilną
// ============================================================
function SearchWithTransition() {
    const [input, setInput] = useState("")     // pilne — dla inputu
    const [query, setQuery] = useState("")     // niepilne — dla listy
    const [isPending, startTransition] = useTransition()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)                 // PILNE: input aktualizuje się od razu
        startTransition(() => {
            setQuery(e.target.value)               // NIEPILNE: lista w tle, przerywalnie
        })
    }

    return (
        <div>
            <input value={input} onChange={handleChange}/>
            {isPending && <span>Filtruję...</span>} {/* masz flagę ładowania */}
            <HeavyList query={query}/>
        </div>
    )
}

// ============================================================
// WERSJA B — useDeferredValue
// oznaczasz SAMĄ WARTOŚĆ jako "może być opóźniona"
// ============================================================
function SearchWithDeferred() {
    const [input, setInput] = useState("")
    const deferredInput = useDeferredValue(input)   // "opóźniona" wersja input
    const isStale = input !== deferredInput          // czy lista jest nieaktualna

    return (
        <div>
            {/* input używa świeżej wartości -> reaguje od razu */}
            <input value={input} onChange={(e) => setInput(e.target.value)}/>
            {isStale && <span>Filtruję...</span>}
            {/* lista używa OPÓŹNIONEJ wartości -> renderuje się w tle */}
            <HeavyList query={deferredInput}/>
        </div>
    )
}