'use client'
import {TodoList} from "./TodoList";

export default function Page() {
    return (
        <main className="p-8">
            <TodoList/>
        </main>
    )
}

// Lista zadań (todo) z filtrowaniem i licznikiem — testuje operacje na tablicy bez mutacji.
//
//     Wymagania:
//
// input + przycisk „Dodaj" (pusty tekst nie dodaje)
// każde zadanie: checkbox (zrobione/nie), tekst, przycisk usunięcia
// filtr: wszystkie / aktywne / ukończone
// licznik: „X z Y ukończonych"
// przycisk „Usuń ukończone"
//
// Typ:
//
//     tsx
// type Todo = {
//     id: number
//     text: string
//     done: boolean
// }
//
// Napisz w strukturze pod testy — czyli logikę wyciągnij z komponentu:
//
//     todo/
// ├── todoLogic.ts       → czyste funkcje (dodawanie, toggle, filtrowanie, liczenie)
// ├── todoLogic.test.ts   → unit testy
// ├── TodoList.tsx        → komponent
// └── TodoList.test.tsx   → RTL