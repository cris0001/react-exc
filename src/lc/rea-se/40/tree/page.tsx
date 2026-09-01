import {Tree} from "./Tree.tsx";


export default function Page(){

    return(
        <Tree/>
    )
}

// Drzewo komentarzy — co widzi i robi user:
//
//     1. Rekurencyjny render zagnieżdżeń
// Komentarze wyświetlają się jak na Reddicie/Twitterze — komentarz,
// pod nim jego odpowiedzi (wcięte), pod nimi odpowiedzi do odpowiedzi (jeszcze głębiej),
// i tak dowolnie głęboko. Każdy poziom wcięty względem rodzica, żeby widać było hierarchię.
//
// 2. Dodawanie odpowiedzi
// Przy każdym komentarzu jest opcja „odpowiedz". User klika, pojawia się pole tekstowe,
// wpisuje odpowiedź, zatwierdza — nowa odpowiedź pojawia się pod tym konkretnym komentarzem
// (jako jego dziecko), wcięta o jeden poziom głębiej.
//
// 3. Usuwanie (z poddrzewem)
// Przy każdym komentarzu opcja „usuń". User klika — znika ten komentarz i wszystkie jego
// odpowiedzi (całe poddrzewo pod nim). Jak usuniesz komentarz, który miał 5 odpowiedzi,
// to znika on i te 5 (i ich odpowiedzi, jeśli były).
//
// 4. Zwijanie/rozwijanie gałęzi
// Przy komentarzu, który ma odpowiedzi, opcja zwinięcia (np. „[−]" / „[+]" albo „zwiń wątek").
// User klika — odpowiedzi tego komentarza chowają się (zostaje sam komentarz).
// Klika znowu — rozwijają się z powrotem. Przydatne przy długich wątkach.
// Zwijanie dotyczy konkretnej gałęzi (reszta drzewa bez zmian).
//
// 5. Immutable update w głąb
// To nie funkcjonalność dla usera, tylko wymóg techniczny: gdy dodajesz/usuwasz/zwijasz w
// głęboko zagnieżdżonym komentarzu, aktualizujesz stan bez mutacji — tworzysz nowe drzewo z
// zmienionym fragmentem, resztę kopiujesz. W React stan musi być immutable (nowe referencje),
// żeby re-render zadziałał. „W głąb" — bo zmiana może być na dowolnym poziomie zagnieżdżenia,
// więc musisz umieć trafić w głąb drzewa i zwrócić nową wersję.
//
// Podsumowanie funkcji:
//
//     widzisz zagnieżdżone komentarze (wcięcia pokazują hierarchię)
// możesz odpowiedzieć na dowolny (nowa odpowiedź pod nim)
// możesz usunąć dowolny (znika z całym poddrzewem)
// możesz zwinąć/rozwinąć wątek (schować/pokazać odpowiedzi gałęzi)
// pod spodem: każda zmiana to immutable update (nowe drzewo, bez mutacji)