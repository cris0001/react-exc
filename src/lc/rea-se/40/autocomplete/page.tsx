// Autocomplete / search
//
// debounce na wpisywaniu
// pobieranie wyników
// obsługa race condition
// nawigacja klawiaturą (strzałki, Enter, Escape)
// click-outside
// podświetlenie aktywnej opcji
// stany loading/empty


import {AutoComplete} from "@/lc/rea-se/40/autocomplete/AutoComplete.tsx";

export default function Page(){


    return <AutoComplete/>
}

// 2. „Scroll do podświetlonej opcji" (gdy lista długa)
// Strzałką schodzisz poza widoczny obszar — podświetlenie znika z pola widzenia. scrollIntoView:
//
// jsx
// useEffect(() => {
//     if (activeIndex < 0) return
//     itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
// }, [activeIndex])
//
// 3. „Cache'uj wyniki / nie fetchuj tego samego dwa razy"
// Wpisałeś „react", potem skasowałeś do „rea", potem znów „react" — nie fetchuj ponownie. Prosty cache (Map albo useRef), albo „użyłbym React Query, które cache'uje po queryKey". To testuje, czy myślisz o wydajności sieci.
//
// 4. „Minimalna długość zapytania"
// Nie fetchuj dla 1 znaku (za dużo wyników, za dużo requestów). if (debouncedSearch.length < 2) return.
//
// Prawdopodobne (średnio):
//
// 5. „Obsłuż wybór wielu opcji" (multi-select / tagi)
// Zamiast jednego selected → tablica wybranych, chipy nad inputem, usuwanie. Zmienia model stanu — testuje elastyczność.
//
// 6. „Pokaż ostatnie wyszukiwania / historię"
// Gdy input pusty a jest focus → pokaż ostatnie wybory (z stanu albo localStorage). Testuje myślenie o UX.
//
// 7. „Co gdy API zwolni / timeout?"
//     Dodaj timeout do fetcha, retry, albo lepszy komunikat błędu. Testuje obsługę edge case'ów sieci.
//
// 8. „Zrób to reużywalne" (refactor do generycznego komponentu)
// „A gdybyś miał autocomplete dla userów i dla produktów?" → generyczny <Autocomplete<T>> z propsami fetchFn, renderItem, getKey. Testuje myślenie o abstrakcji i TypeScript generics. To jest częsty senior-dorzutek.
//
//     Mniej prawdopodobne, ale możliwe:
//
//     9. „Wyciągnij logikę do custom hooka"
// useAutocomplete(query) zwracające { data, loading, error }. Separacja logiki od UI.
//
// 10. „Dodaj testy"
// Jak przetestowałbyś debounce / race / wybór? Nawet opisanie (RTL, mock fetch, fake timers) się liczy.
//
// 11. „Pełna dostępność"
// aria-activedescendant, live region, role combobox — omawialiśmy.