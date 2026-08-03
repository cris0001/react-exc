
import {Counter} from './Counter'


export default function Page(){

    return <Counter/>
}


// ZADANIE — Licznik z krokami i limitami
//
// Prosty na pierwszy rzut oka, ale ma pułapki, które sprawdzają uważność.
//
//     Wymagania:
//
// Licznik — wyświetla liczbę, start od 0
// + / − — przyciski zwiększają/zmniejszają o step
// Krok konfigurowalny — input, w którym ustawiasz step (o ile zmienia licznik)
// Limity — licznik nie schodzi poniżej min (0) ani powyżej max (100)
// Blokada przycisków — „+" nieaktywny gdy na max, „−" nieaktywny gdy na min
// Reset — przycisk zeruje licznik
//
// Zasady egzaminu:
//
//     całość sam, jeden plik, useState
// werbalizuj decyzje w komentarzach
// ~20-25 min (krótsze niż poprzednie)
// w połowie dorzucę wymóg