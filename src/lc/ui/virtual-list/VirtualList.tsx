'use client'

import {useMemo, useRef} from "react"
import {useVirtualizer} from "@tanstack/react-virtual"
import {generateItems} from "./data"

// ============================================================================
// TA SAMA LISTA, ALE PRZEZ BIBLIOTEKĘ.
// Struktura trójwarstwowa jest identyczna jak w wersji ręcznej —
// biblioteka liczy tylko indeksy, offsety i obsługuje przypadki brzegowe.
// ============================================================================

const CONTAINER_HEIGHT = 400

export function VirtualList() {
    const items = useMemo(() => generateItems(10_000), [])

    // ref na element, który się scrolluje — biblioteka musi go obserwować
    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: items.length,                 // ile jest wszystkich wierszy
        getScrollElement: () => parentRef.current,
        estimateSize: () => 40,              // szacowana wysokość wiersza
        overscan: 5,
    })

    const virtualRows = virtualizer.getVirtualItems()

    const scrollToRandom = () => {
        const index = Math.floor(Math.random() * items.length)
        virtualizer.scrollToIndex(index, {align: "center"})
    }

    return (
        <div>
            <div className="mb-2 flex items-center gap-4">
                <button
                    onClick={scrollToRandom}
                    className="border border-gray-400 px-3 py-1 rounded"
                >
                    Przewiń do losowego
                </button>
                <span className="text-sm text-gray-600">
                    {items.length} wierszy, {virtualRows.length} w DOM
                </span>
            </div>

            {/* WARSTWA 1 — kontener ze scrollem */}
            <div
                ref={parentRef}
                style={{height: CONTAINER_HEIGHT, overflowY: "auto"}}
                className="border border-gray-300 rounded"
                data-testid="virtual-container"
            >
                {/* WARSTWA 2 — spacer o pełnej wysokości */}
                <div
                    style={{
                        height: virtualizer.getTotalSize(),
                        width: "100%",
                        position: "relative",
                    }}
                >
                    {/* WARSTWA 3 — widoczne wiersze */}
                    {virtualRows.map((virtualRow) => {
                        const item = items[virtualRow.index]

                        return (
                            <div
                                key={virtualRow.key}
                                // measureElement pozwala na ZMIENNE wysokości —
                                // biblioteka mierzy realny element i koryguje offsety.
                                // Przy stałej wysokości można to pominąć.
                                ref={virtualizer.measureElement}
                                data-index={virtualRow.index}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                className="flex items-center px-3 border-b border-gray-100 h-10"
                            >
                                {item.name} — {item.email}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------------
// CO DAJE BIBLIOTEKA PONAD WERSJĘ RĘCZNĄ:
//   - zmienne wysokości (measureElement mierzy realny DOM i koryguje offsety)
//   - scrollToIndex z wyrównaniem (start / center / end)
//   - ResizeObserver na kontenerze
//   - scroll poziomy, siatki 2D
//   - sticky items
//   - dynamiczne dodawanie/usuwanie elementów bez skakania scrolla
//
// KIEDY NIE WIRTUALIZOWAĆ:
//   - lista < ~100 elementów (narzut większy niż zysk)
//   - treść musi być indeksowana przez wyszukiwarki
//   - user musi móc użyć Ctrl+F po całej liście
//   - paginacja rozwiązuje problem prościej (i jest lepsza dla SEO)
// ----------------------------------------------------------------------------
