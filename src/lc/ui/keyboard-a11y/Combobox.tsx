'use client'

import {useEffect, useId, useRef, useState} from "react"

type ComboboxProps = {
    label: string
    options: string[]
    value: string
    onChange: (value: string) => void
}

export function Combobox({label, options, value, onChange}: ComboboxProps) {
    const [query, setQuery] = useState(value)
    const [isOpen, setIsOpen] = useState(false)

    // INDEKS PODŚWIETLONEJ OPCJI. -1 = nic nie podświetlone.
    // To NIE jest focus DOM — focus zostaje na inpucie przez cały czas.
    const [activeIndex, setActiveIndex] = useState(-1)

    // useId daje stabilny, unikalny prefiks — kilka comboboxów na stronie
    // nie skolizuje się id-kami. Ważne, bo aria-activedescendant wskazuje
    // opcję właśnie po id.
    const id = useId()
    const listboxId = `${id}-listbox`
    const optionId = (index: number) => `${id}-option-${index}`

    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const filtered = options.filter((option) =>
        option.toLowerCase().includes(query.toLowerCase())
    )

    // Reset podświetlenia, gdy zmienia się lista wyników.
    // Bez tego activeIndex mógłby wskazywać poza tablicę po zawężeniu filtra.
    useEffect(() => {
        setActiveIndex(-1)
    }, [query])

    // Przewijanie podświetlonej opcji do widoku — przy nawigacji klawiaturą
    // opcja może być poza widocznym obszarem listy.
    useEffect(() => {
        if (activeIndex < 0 || !listRef.current) return

        const activeElement = listRef.current.querySelector(`#${CSS.escape(optionId(activeIndex))}`)
        activeElement?.scrollIntoView({block: "nearest"})
    }, [activeIndex])

    // zamykanie kliknięciem poza komponentem
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
                setActiveIndex(-1)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const selectOption = (option: string) => {
        onChange(option)
        setQuery(option)
        setIsOpen(false)
        setActiveIndex(-1)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case "ArrowDown": {
                // preventDefault — bez tego strzałka przesuwa KARETKĘ w inpucie
                // (i przewija stronę), zamiast nawigować po liście
                e.preventDefault()

                if (!isOpen) {
                    setIsOpen(true)
                    setActiveIndex(0)
                    return
                }
                // ZAWIJANIE: z ostatniej opcji skaczemy na pierwszą.
                // Modulo załatwia to jedną linijką.
                setActiveIndex((prev) => (prev + 1) % filtered.length)
                return
            }

            case "ArrowUp": {
                e.preventDefault()

                if (!isOpen) {
                    setIsOpen(true)
                    setActiveIndex(filtered.length - 1)
                    return
                }
                // -1 z zawijaniem: (prev - 1 + len) % len.
                // Samo (prev - 1) % len dałoby -1 dla prev=0 — JS nie zawija
                // ujemnych przy modulo, stąd dodanie length.
                setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length)
                return
            }

            case "Home": {
                if (!isOpen) return
                e.preventDefault()
                setActiveIndex(0)
                return
            }

            case "End": {
                if (!isOpen) return
                e.preventDefault()
                setActiveIndex(filtered.length - 1)
                return
            }

            case "Enter": {
                // Enter wybiera TYLKO gdy coś jest podświetlone.
                // Bez tego warunku Enter w otwartej liście bez wyboru
                // "wybierałby" przypadkową opcję albo wysyłał formularz.
                if (isOpen && activeIndex >= 0 && filtered[activeIndex]) {
                    e.preventDefault()
                    selectOption(filtered[activeIndex])
                }
                return
            }

            case "Escape": {
                // DWA POZIOMY: pierwszy Escape zamyka listę,
                // drugi (przy zamkniętej liście) czyści pole.
                // Taki wzorzec zaleca APG dla comboboxa.
                if (isOpen) {
                    setIsOpen(false)
                    setActiveIndex(-1)
                } else {
                    setQuery("")
                    onChange("")
                }
                return
            }

            case "Tab": {
                // Tab wychodzi z pola — lista musi się zamknąć,
                // inaczej zostaje otwarta nad resztą strony
                setIsOpen(false)
                setActiveIndex(-1)
                return
            }
        }
    }

    return (
        <div ref={containerRef} className="relative w-80">
            <label htmlFor={`${id}-input`} className="block mb-1">
                {label}
            </label>

            <input
                id={`${id}-input`}
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                    setIsOpen(e.target.value !== "")
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => query && setIsOpen(true)}

                // ---- ARIA ----
                role="combobox"
                // czy lista jest rozwinięta
                aria-expanded={isOpen}
                // którą listę kontroluje ten input
                aria-controls={listboxId}
                // KLUCZOWE: wskazuje "wirtualnie zafokusowaną" opcję po id.
                // Focus DOM zostaje na inpucie — czytnik ekranu i tak ogłasza
                // wskazaną opcję. Dzięki temu user może jednocześnie pisać
                // i nawigować strzałkami.
                aria-activedescendant={
                    activeIndex >= 0 ? optionId(activeIndex) : undefined
                }
                // podpowiedzi pojawiają się na liście (nie inline w polu)
                aria-autocomplete="list"
                autoComplete="off"

                className="w-full border border-gray-300 p-2 rounded"
            />

            {isOpen && (
                <ul
                    ref={listRef}
                    id={listboxId}
                    role="listbox"
                    aria-label={label}
                    className="absolute w-full border border-gray-300 rounded mt-1 bg-white max-h-60 overflow-y-auto z-10"
                >
                    {filtered.length === 0 && (
                        // role="presentation" — to nie jest wybieralna opcja,
                        // tylko komunikat. Bez tego czytnik ogłosiłby go jako opcję.
                        <li role="presentation" className="p-2 text-gray-500">
                            Brak wyników
                        </li>
                    )}

                    {filtered.map((option, index) => (
                        <li
                            key={option}
                            id={optionId(index)}
                            role="option"
                            aria-selected={index === activeIndex}
                            // onMouseDown, NIE onClick: mousedown leci PRZED blur.
                            // Przy onClick input straciłby focus, lista zamknęłaby się
                            // (click-outside) i kliknięcie nigdy by nie doszło.
                            onMouseDown={(e) => {
                                e.preventDefault()   // nie zabieraj focusa z inputa
                                selectOption(option)
                            }}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={[
                                "p-2 cursor-pointer",
                                index === activeIndex ? "bg-blue-100" : "",
                            ].join(" ")}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}

            {/* Komunikat dla czytnika o liczbie wyników.
                aria-live="polite" ogłasza zmianę bez przerywania pisania. */}
            <div aria-live="polite" className="sr-only">
                {isOpen ? `${filtered.length} wyników` : ""}
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------------
// DLACZEGO aria-activedescendant, A NIE PRAWDZIWY FOCUS NA OPCJACH
//
// Gdybyś robił element.focus() na opcji, focus opuściłby input — user nie
// mógłby dalej pisać, a każde naciśnięcie klawisza trafiałoby do listy.
// aria-activedescendant rozdziela te dwie rzeczy:
//   - FOCUS DOM      zostaje na inpucie (klawisze trafiają tam)
//   - "AKTYWNY" ELEMENT wskazywany jest po id (czytnik ogłasza właśnie jego)
//
// DLACZEGO onMouseDown, A NIE onClick
// Kolejność zdarzeń: mousedown -> blur -> mouseup -> click.
// Przy onClick blur zdążyłby zamknąć listę, a kliknięta opcja zniknęłaby
// z DOM zanim click doleci. Klasyczna pułapka przy dropdownach.
//
// DLACZEGO preventDefault PRZY STRZAŁKACH
// Domyślnie ArrowUp/ArrowDown przesuwają karetkę w polu tekstowym
// i przewijają stronę. Bez preventDefault nawigacja po liście "szarpie".
// ----------------------------------------------------------------------------
