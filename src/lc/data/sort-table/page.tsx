'use client'

import {UserList} from "./UserList"


export type User = {
    id: number
    name: string
    email: string
    age: number
    role: "admin" | "user" | "editor"
    active: boolean
}

const firstNames = ["Anna", "Piotr", "Maria", "Krzysztof", "Katarzyna", "Tomasz", "Magdalena", "Marcin", "Agnieszka", "Michał", "Barbara", "Jakub", "Ewa", "Andrzej", "Joanna", "Paweł", "Zofia", "Łukasz", "Aleksandra", "Grzegorz"]
const lastNames = ["Nowak", "Kowalski", "Wiśniewski", "Wójcik", "Kowalczyk", "Kamiński", "Lewandowski", "Zieliński", "Szymański", "Woźniak", "Dąbrowski", "Kozłowski", "Jankowski", "Mazur", "Kwiatkowski", "Krawczyk", "Piotrowski", "Grabowski", "Nowakowski", "Pawłowski"]
const roles: User["role"][] = ["admin", "user", "editor"]
function seeded(i: number, mod: number) {
    return (i * 2654435761) % mod
}
export const USERS: User[] = Array.from({ length: 45}, (_, i) => {
    const first = firstNames[seeded(i, firstNames.length)]
    const last = lastNames[seeded(i + 7, lastNames.length)]
    const name = `${first} ${last}`
    return {
        id: i + 1,
        name,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`
            .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
            .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
            .replace(/ś/g, "s").replace(/ż|ź/g, "z"),
        age: 22 + seeded(i + 3, 40),
        role: roles[seeded(i + 1, roles.length)],
        active: seeded(i, 3) !== 0,
    }
})


export default function Page() {
    return (
        <main className="p-8">
            <UserList users={USERS} />
        </main>
    )
}


// ============================================================================
// Tabela z sortowaniem, filtrowaniem i paginacją
// ============================================================================
//
// Tabela — kolumny: name, email, age, role, status (active)
// Sortowanie — klik w nagłówek kolumny sortuje; drugi klik odwraca kierunek; wskaźnik kierunku (▲/▼)
//
// Filtrowanie tekstowe — input, filtruje po name i email (case-insensitive)
//
// Filtr po roli — select (all / admin / user / editor)
// Paginacja — np. 10 wierszy na stronę, przyciski poprzednia/następna + numer strony
// Licznik — „pokazano X z Y" (po filtrach)
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
