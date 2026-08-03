'use client'

import {useMemo, useRef, useState} from "react"
import {generateItems} from "./data"

// ============================================================================
// WIRTUALIZACJA OD ZERA — mechanizm w ~40 liniach.
//
// TRZY WARSTWY:
//   1. KONTENER  — stała wysokość + overflow-y:auto. To on się scrolluje.
//   2. SPACER    — pusty div o wysokości CAŁEJ listy (items * rowHeight).
//                  Utrzymuje pasek przewijania tak, jakby wszystkie wiersze były.
//   3. WIERSZE   — tylko widoczne, pozycjonowane absolutnie przez translateY.
//
// Bez spacera scrollbar byłby wysokości 20 wierszy zamiast 10 000.
// Bez translateY widoczne wiersze zawsze rysowałyby się na górze kontenera.
// ============================================================================

const ROW_HEIGHT = 40      // stała wysokość wiersza — kluczowe uproszczenie
const CONTAINER_HEIGHT = 400
const OVERSCAN = 5         // ile wierszy dorenderować poza widok (bufor)

export function SimpleVirtualList() {
    // useMemo, bo generowanie 10 000 obiektów przy każdym renderze
    // (a renderujemy przy KAŻDYM zdarzeniu scroll) byłoby zabójcze
    const items = useMemo(() => generateItems(10_000), [])

    const [scrollTop, setScrollTop] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // ---- OBLICZENIA: który wycinek listy jest widoczny ----

    // ile wierszy mieści się w kontenerze
    const visibleCount = Math.ceil(CONTAINER_HEIGHT / ROW_HEIGHT)

    // pierwszy widoczny index = ile pikseli przescrollowano / wysokość wiersza
    // Math.max(0, ...) — bez tego przy scrollTop=0 i overscanie zeszlibyśmy poniżej zera
    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN)

    // ostatni + overscan, przycięty do długości listy
    const endIndex = Math.min(
        items.length,
        startIndex + visibleCount + OVERSCAN * 2
    )

    const visibleItems = items.slice(startIndex, endIndex)

    // przesunięcie całego bloku wierszy — musi odpowiadać pozycji startIndex
    const offsetY = startIndex * ROW_HEIGHT

    const totalHeight = items.length * ROW_HEIGHT

    return (
        <div>
            <p className="mb-2 text-sm text-gray-600">
                {items.length} wierszy w danych, {visibleItems.length} w DOM
            </p>

            {/* WARSTWA 1 — kontener ze scrollem */}
            <div
                ref={containerRef}
                onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
                style={{height: CONTAINER_HEIGHT, overflowY: "auto"}}
                className="border border-gray-300 rounded"
                data-testid="scroll-container"
            >
                {/* WARSTWA 2 — spacer trzymający pełną wysokość */}
                <div style={{height: totalHeight, position: "relative"}}>
                    {/* WARSTWA 3 — widoczne wiersze, przesunięte na właściwą pozycję */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            transform: `translateY(${offsetY}px)`,
                        }}
                    >
                        {visibleItems.map((item) => (
                            <div
                                key={item.id}
                                style={{height: ROW_HEIGHT}}
                                className="flex items-center px-3 border-b border-gray-100"
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------------
// DLACZEGO translateY, A NIE top?
// transform nie wywołuje layoutu — przeglądarka przesuwa gotową warstwę
// na GPU. `top` wymusiłby reflow przy każdym zdarzeniu scroll.
//
// DLACZEGO OVERSCAN?
// Zdarzenie scroll -> setState -> render -> commit trwa kilka milisekund.
// Przy szybkim scrollowaniu użytkownik zdążyłby zobaczyć puste miejsce,
// zanim nowe wiersze się doliczą. Overscan trzyma bufor poza widokiem.
//
// CZEGO TU BRAKUJE (i dlatego w produkcji bierze się bibliotekę):
//   - zmienne wysokości wierszy (trzeba mierzyć każdy i cache'ować)
//   - reakcja na resize kontenera (ResizeObserver)
//   - scrollToIndex
//   - scroll poziomy
//   - sticky headers
//   - throttling zdarzeń scroll
// ----------------------------------------------------------------------------
