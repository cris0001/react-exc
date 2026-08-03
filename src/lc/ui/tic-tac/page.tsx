'use client'


import {TicTac} from "./TicTac";

export default function Page() {

    return (
        <>
            <TicTac/>
        </>
    )
}


// Plansza 3×3, dwóch graczy (X i O) na zmianę, wykrywanie wygranej i remisu.
//
//
// Requirements:
//


//
// plansza 3×3 — klikasz pole, stawia się znak aktualnego gracza
// naprzemienność — X, potem O, potem X…
// pole zajęte — nie da się nadpisać
// wykrycie wygranej — 3 w rzędzie (poziom, pion, skos) → pokaż kto wygrał, zablokuj dalsze ruchy
// remis — plansza pełna, brak wygranej → „remis"
// reset — przycisk zaczyna od nowa
// status — „ruch gracza X" / „wygrywa O" / „remis"