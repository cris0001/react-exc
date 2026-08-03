

import {StepForm} from './StepForm'

export default function Page (){


    return(
        <>
        <StepForm/>
        </>
    )
}


//
// Formularz w 3 krokach, z paskiem postępu, walidacją każdego kroku, nawigacją wstecz/dalej, podsumowaniem na końcu.
//
//     Kroki
// Dane osobowe — imię, email
// Adres — ulica, miasto, kod pocztowy
// Podsumowanie — pokaż wszystko, przycisk „Wyślij"
// Wymagania
// nawigacja — „Dalej" / „Wstecz", wskaźnik kroku (1/3, 2/3, 3/3) albo pasek postępu
// walidacja per krok — „Dalej" zablokowane / pokazuje błędy, póki bieżący krok niepoprawny. Nie przejdziesz dalej z pustym emailem.
// stan między krokami — wracasz do kroku 1, dane wciąż tam są (nie resetują się)
// podsumowanie — krok 3 pokazuje wszystkie zebrane dane
// wysyłka — „Wyślij" na końcu (może być console.log albo fake API)