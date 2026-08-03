import { UserList} from './UserList'
import {useCallback, useState} from "react";

export type User = {
    id:number,name:string, email:string, active:boolean
}

const USERS: User[] = [
    { id: 1, name: "Anna Nowak", email: "kforge82@example.com", active: true },
    { id: 2, name: "Piotr Kowalski", email: "zephyr.qi@example.com", active: false },
    { id: 3, name: "Maria Wiśniewska", email: "bluecat_44@example.com", active: true },
    { id: 4, name: "Jakub Lewandowski", email: "mx7volt@example.com", active: false },
    { id: 5, name: "Ewa Zielińska", email: "quokka.dev@example.com", active: true },
    { id: 6, name: "Tomasz Kamiński", email: "n0rthwind@example.com", active: true },
    { id: 7, name: "Katarzyna Wójcik", email: "pixel.jam9@example.com", active: false },
    { id: 8, name: "Michał Kowalczyk", email: "vortex_qr@example.com", active: true },
    { id: 9, name: "Magdalena Szymańska", email: "lumen88@example.com", active: false },
    { id: 10, name: "Marcin Woźniak", email: "gizmo.42x@example.com", active: true },
    { id: 11, name: "Agnieszka Dąbrowska", email: "frost_owl@example.com", active: true },
    { id: 12, name: "Paweł Kozłowski", email: "kx9tango@example.com", active: false },
    { id: 13, name: "Barbara Jankowska", email: "misty.vale@example.com", active: true },
    { id: 14, name: "Grzegorz Mazur", email: "razor44q@example.com", active: false },
    { id: 15, name: "Joanna Krawczyk", email: "echo_lynx@example.com", active: true },
]


export default function Page(){

    const [users,setUsers] = useState(USERS)

    const handleToggle = useCallback((id: User['id']) => {

        setUsers(prev => prev.map(u =>
            u.id === id ? { ...u, active: !u.active } : u
        ));
    },[])

    return <UserList data={users} handleToggle={handleToggle}/>
}

//
// Dostajesz tablicę użytkowników (dam poniżej). Zbuduj komponent, który je wyświetla i pozwala z nimi pracować.
//
//     Wymagania:
//
// Lista — pokaż użytkowników (imię, email, status: aktywny/nieaktywny)
// Wyszukiwarka — filtruj po imieniu lub emailu, live (case-insensitive)
// Toggle statusu — przycisk przy każdym userze przełącza aktywny/nieaktywny
// Licznik — „Aktywni: X / Y" (aktywni ze wszystkich)
// Pusty stan — gdy filtr nic nie znajdzie, pokaż komunikat
//
// Dane startowe:
//
//     ts
// type User = { id: number; name: string; email: string; active: boolean }
//
// const USERS: User[] = [
//     { id: 1, name: "Anna Nowak", email: "anna@example.com", active: true },
//     { id: 2, name: "Piotr Kowalski", email: "piotr@example.com", active: false },
//     { id: 3, name: "Maria Wiśniewska", email: "maria@example.com", active: true },
//     { id: 4, name: "Jakub Lewandowski", email: "jakub@example.com", active: false },
//     { id: 5, name: "Ewa Zielińska", email: "ewa@example.com", active: true },
// ]