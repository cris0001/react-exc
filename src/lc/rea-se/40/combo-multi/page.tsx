// Combobox / multi-select
//
// filtrowanie opcji
// zaznaczanie wielu
// nawigacja klawiaturą
// a11y (aria-role, aria-selected)
// usuwanie zaznaczonych (chip/tag)
// click-outside


import {ComboMulti} from "@/lc/rea-se/40/combo-multi/ComboMulti.tsx";
import {ComboMulti2} from "@/lc/rea-se/40/combo-multi/ComboMulti2.tsx";

export default function Page(){

    return <>
    {/*<ComboMulti/>*/}
    <ComboMulti2/>
    </>
}

// Co to jest:
//
//     Input z rozwijaną listą opcji, gdzie: wpisujesz tekst → filtruje opcje, zaznaczasz wiele
//     (nie jedną), zaznaczone pokazują się jako chipy/tagi (z „x" do usunięcia), nawigujesz klawiaturą, działa a11y.
//
// Stany, które będziesz trzymać:
//
//     query — tekst wpisany w input (do filtrowania)
// selected — tablica zaznaczonych opcji (wiele)
// isOpen — czy lista rozwinięta
// highlightedIndex — który element listy podświetlony (nawigacja klawiaturą)
//
// Funkcje do zrobienia — po kolei:
//
//     1. Filtrowanie opcji:
//
//     input z query
// lista opcji filtrowana po query (pokazuj tylko pasujące)
// zwykle też ukrywaj już zaznaczone z listy (albo pokazuj z checkmarkiem — decyzja)
// pusta lista → komunikat „brak wyników"
//
// 2. Zaznaczanie wielu:
//
//     klik w opcję → dodaj do selected (nie zamykaj listy — multi, więc user zaznacza dalej)
// klik w zaznaczoną → odznacz (toggle)
// lista zostaje otwarta po zaznaczeniu (inaczej niż single-select)
// opcjonalnie: wyczyść query po zaznaczeniu (żeby łatwo szukać kolejnej)
//
// 3. Chipy/tagi zaznaczonych:
//
    //     zaznaczone opcje renderowane jako chipy (nad/w inpucie)
    // każdy chip ma „x" → klik usuwa z selected
// chipy pokazują, co wybrane, bez otwierania listy
//
// 4. Usuwanie zaznaczonych:
//
//     „x" na chipie → usuń tę opcję z selected
// Backspace na pustym inpucie → usuń ostatni chip (klawiaturowy sposób, standard)
//
// 5. Nawigacja klawiaturą:
//
//     ArrowDown/ArrowUp — przesuwa highlightedIndex po widocznych opcjach (z zawijaniem albo bez)
// Enter — zaznacza/odznacza podświetloną opcję
// Escape — zamyka listę (isOpen = false)
// Backspace (pusty input) — usuwa ostatni chip
// podświetlona opcja wizualnie wyróżniona (tło)
//
// 6. Click-outside:
//
// klik poza komponentem → zamknij listę (isOpen = false)
// ref na kontener + listener (jak w autocomplete)
//
// 7. a11y (aria):
//
// input: role="combobox", aria-expanded={isOpen}, aria-controls (id listy)
// lista: role="listbox", aria-multiselectable="true"
// opcje: role="option", aria-selected={czy zaznaczona}
// podświetlona opcja: aria-activedescendant na inpucie (wskazuje aktywną opcję dla czytnika)
// chipy: dostępne do usunięcia (aria-label „usuń X")