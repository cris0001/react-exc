'use client'


import {AutoComplete} from "./AutoComplete";

export default function Page() {

    return (
        <>
            <AutoComplete/>
        </>
    )
}


// Pole tekstowe. User pisze, ty odpytujesz „API" i pokazujesz podpowiedzi pod inputem. Ma działać płynnie i nie zabijać serwera requestem na każdą literę.
//
//
// Requirements:
//


//
// input — user wpisuje frazę
// debounce — nie odpytuj API na każdy znak; poczekaj aż przestanie pisać (~300ms)
// fetch wyników — po debounce odpytaj API, pokaż listę podpowiedzi
// stany — pokaż „ładowanie", pustą listę („brak wyników"), i wyniki
// race condition — jak user pisze szybko, starsze requesty nie mogą nadpisać nowszych (wpisujesz „react", wynik dla „rea" nie może przyjść po wyniku dla „react")
// czyszczenie — pusty input = brak podpowiedzi, żadnego requestu