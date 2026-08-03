import {useRef, useState} from "react";
import {messageKeys} from "@/app/(authorized)/messages/hooks/useMessages";

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}

// Zadanie 1 — mapped types:
//     Napisz typ FormState<T> który tworzy stan formularza:
//     values — wszystkie pola jako string
//     errors — wszystkie pola jako string | undefined
//     touched — wszystkie pola jako boolean

type FormState<T> = {
    values: { [K in keyof T]: string };
    errors: { [K in keyof T]: string | undefined };
    touched: { [K in keyof T]: boolean };
}

// Zadanie 2 — discriminated union + infer:
// Napisz typ ApiState<T> z wariantami idle, loading, success, error i funkcję handleState która zwraca string dla każdego wariantu.



type ApiState<T> =
    | { variant: 'idle' }
    | { variant: 'loading'; message: string }
    | { variant: 'success'; data: T }
    | { variant: 'error'; message: string }


function handleState(x:ApiState<User[]>){
 switch(x.variant){
     case'idle':
         return 'idle xd'
     case 'loading':
         return 'Ładowanie...';
     case 'success':
         return `Załadowano ${x.data.length} userów`;
     case 'error':
         return `Błąd  ${x.message}`;
     default:
         const def: never = x;
         return def;
 }
}


// napisz typ IsArray<T> który zwraca true jeśli T to tablica, false jeśli nie
type IsArray<T> = T extends any[] ? true : false;


// napisz typ NotificationState z wariantami:
// - info z message: string
// - warning z message: string i count: number
// - error z message: string i code: number
// - success z message: string


type NotificationState=
    | {variant:'info', message:string}
    | {variant:'warning', message:string, count:number}
    | {variant:'error', message:string, count:number}
    | {variant:'success', message:string,}

function getNotificationColor(r:NotificationState){
    switch(r.variant){
        case'info': return r.message
        case'warning': return r.message
        case'error': return r.message
        case'success': return r.message
        default:
            const x:never = r
            return x

    }

}

// Typ ReadonlyPartial<T> — wszystkie pola opcjonalne i readonly jednocześnie

type ReadonlyPartial<T> = Readonly<Partial<T>>


// Typ NullableFields<T> — każde pole może być null

type NullableFields<T> = {[K in keyof T]: T[K]|null}

// Typ StringOnly<T> — zostają tylko pola gdzie wartość to string

type StringOnly<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K] }

// masz funkcję
function getUser(id: number) {
    return { id, name: 'Anna', role: 'admin' as const };
}

// typ User wyciągnięty z getUser przez ReturnType

type User2 = ReturnType<typeof getUser>


// typ UserRole wyciągnięty z pola role przez indexed access

type UserRole = User2['role']


// masz obiekt
const ENDPOINTS = {
    users: '/api/users',
    products: '/api/products',
    orders: '/api/orders',
} as const;

// typ Endpoint — union wszystkich ścieżek

type Endpoint = typeof ENDPOINTS[keyof typeof ENDPOINTS]

// typ EndpointKey — union wszystkich kluczy

type EndpointKey= keyof typeof ENDPOINTS

// funkcję fetchEndpoint która przyjmuje tylko prawidłowy EndpointKey


function fetchEndpoint(url: Endpoint){

}


// Napisz komponent UserList który:
//
//     Przyjmuje propsy: users: User[], onDelete: (id: number) => void, isLoading?: boolean
// Używa useState dla selectedId: number | null
// Używa useRef dla HTMLUListElement
// Ma handler onSelect który przyjmuje React.MouseEvent<HTMLLIElement>
// Gdy isLoading — zwraca <p>Ładowanie...</p>
// Gdy brak userów — zwraca <p>Brak userów</p>

interface Props{
    users: User[],
    onDelete: (id: number) => void,
    isLoading?:boolean
}


const UserList = ({users,onDelete,isLoading}:Props)=>{

    const[selectedId, setSelectedId] = useState<number|null>(null)
    const ref= useRef<HTMLUListElement>
    const onSelect=(e:React.MouseEvent<HTMLLIElement> )=>{
        console.log('zzz')
    }

    // if(isLoading) return <p>Ładowanie...</p>
    // if(users.length<1) return <p>Brak userów</p>

}