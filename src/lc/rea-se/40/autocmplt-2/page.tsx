import {Autocomplete2} from './Autocomplete2'

export default  function Page(){

    return (
        <>
        <Autocomplete2/>
        </>
    )
}

// Pole wyszukiwania, które podpowiada wyniki z „API" na bieżąco.
//
// Wymagania:
//
//     Input — user pisze, pokazują się podpowiedzi
// Debounce — nie odpytuj API na każdą literę (czekaj ~300ms ciszy)
// Async fetch — pobierz wyniki (symuluj API z opóźnieniem)
// Loading state — pokaż „ładowanie" podczas fetch
// Race condition — jeśli user pisze szybko, ignoruj stare odpowiedzi (tylko najnowsza się liczy)
// Klik w podpowiedź — wypełnia input, chowa listę
// Pusty input → brak listy
//
// Symulacja API:
//
//     tsx
// const fakeApi = (query: string): Promise<string[]> => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             const all = ['apple', 'apricot', 'banana', 'blueberry', 'cherry', 'grape', 'orange']
//             resolve(all.filter((x) => x.includes(query.toLowerCase())))
//         }, 500 + Math.random() * 500)   // losowe opóźnienie (dla race condition)
//     })
// }
//
//
// debounce — useEffect + setTimeout albo custom hook (opóźnij fetch)
// race condition — losowe opóźnienie API → stara odpowiedź może wrócić PO nowszej. Musisz ignorować przestarzałe (flaga ignore w useEffect cleanup, albo AbortController)
// cleanup — anuluj poprzedni fetch przy nowym zapytaniu
// loading — stan ładowania