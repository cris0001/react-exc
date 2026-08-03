'use client'


import {Comments} from "@/lc/ui/comment-tree/Comments.tsx";
import {Comment} from "@/lc/ui/comment-tree/treeLogic.ts";

const initialTree: Comment[] = [
    {
        id: 1,
        name: "Anna",
        text: "Pierwszy komentarz",
        replies: [
            {
                id: 2,
                name: "Bartek",
                text: "Odpowiedź do pierwszego",
                replies: [
                    { id: 3, name: "Celina", text: "Odpowiedź do odpowiedzi", replies: [] },
                    { id: 5, name: "Celina", text: "Odpowiedź do odpowiedzi 2", replies: [
                            { id: 6, name: "Celina", text: "Odpowiedź do odpowiedzi do odpowidzi xd", replies: [] },
                        ] },
                ],
            },
        ],
    },
    {
        id: 4,
        name: "Dawid",
        text: "Drugi komentarz bez odpowiedzi",
        replies: [],
    },
    {
        id: 44,
        name: "TYYY",
        text: "Pierwszy komentarz",
        replies: [
            {
                id: 24,
                name: "Bartek",
                text: "Odpowiedź do pierwszego",
                replies: [
                    { id: 33, name: "Celina", text: "Odpowiedź do odpowiedzi", replies: [] },
                    { id: 51, name: "Celina", text: "Odpowiedź do odpowiedzi 2", replies: [
                            { id: 65, name: "Celina", text: "Odpowiedź do odpowiedzi do odpowidzi xd", replies: [] },
                        ] },
                ],
            },
        ],
    },
]

export default function Page() {
    return (
        <main className="p-2">
            <Comments initialTree={initialTree}/>
        </main>
    )
}



// Drzewo komentarzy — wymagania:
//
// render rekurencyjny — każdy komentarz renderuje swoje replies tym samym komponentem
// wcięcie wg głębokości — im głębiej, tym większe wcięcie z lewej
// zwiń / rozwiń — przycisk chowa/pokazuje poddrzewo odpowiedzi
// licznik odpowiedzi — liczba bezpośrednich odpowiedzi przy komentarzu
// dodaj odpowiedź — inline formularz; nowa odpowiedź dochodzi w to miejsce w drzewie
// (bonus) usuń — kasuje komentarz razem z całym poddrzewem