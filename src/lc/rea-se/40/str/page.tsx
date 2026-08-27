import {Star} from './Star'

export default function Page(){
    return(
        <>
        <Star/>
        </>
    )
}

//
// Wymagania podstawowe:
//
//     5 gwiazdek — klikalne, klik ustawia ocenę (1-5).
//     Hover preview — najechanie podświetla gwiazdki do kursora (podgląd oceny przed kliknięciem). Zjazd myszą → wraca do wybranej.
//     Wyświetl ocenę — „3/5" obok gwiazdek.
// Kontrolowany — ocena w stanie, gwiazdki odzwierciedlają stan.
//
// Rozszerzenia (jak zostanie czas):
//
// Konfigurowalny max — prop max (np. 10 gwiazdek zamiast 5), domyślnie 5.
// Reset — klik w już wybraną gwiazdkę czyści ocenę (albo osobny przycisk).
// Half-star — pół gwiazdki (klik w lewą połowę = 0.5, prawą = 1). Trudniejsze.
//     Klawiatura — strzałki lewo/prawo zmieniają ocenę, a11y (role, aria-label).
//     readOnly — tryb tylko do odczytu (pokazuje ocenę, nie klikalne).
// onChange callback — prop onChange(rating) woła się przy zmianie.