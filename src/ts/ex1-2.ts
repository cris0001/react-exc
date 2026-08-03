import {useState} from "react";

interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}


// napisz funkcję processResponse która:
// - przyjmuje ApiResponse<T>
// - zwraca tylko data
// - T musi być obiektem (constraint)

function processResponse<T extends object>(x:ApiResponse<T>){
    return x.data
}



// napisz funkcję safeGet która:
// - przyjmuje obiekt T i klucz K
// - zwraca Result<T[K]>:
//   | { ok: true; value: T[K] }
//   | { ok: false; error: string }
// - jeśli klucz istnieje → ok: true z wartością
// - jeśli nie → ok: false z błędem


type Result<T> =
    | { ok: true; value: T }
    | { ok: false; error: string }



function safeGet<T extends object,K extends keyof T>(obj:T, key:K):Result<T[K]>{
    if (key in obj) {
        return { ok: true, value: obj[key] };
    }
    return { ok: false, error: `Klucz '${String(key)}' nie istnieje` };

}



// masz funkcje API
async function getUser2(id: number): Promise<User> { return {} as User; }
async function getProducts2(category: string): Promise<Product[]> { return []; }


// Typ AsyncReturnType<T> — wyciąga typ z async funkcji przez infer

type AsyncReturnType<T> = T extends (...args:any[])=> Promise<infer U>? U :never


// Typ ApiEndpoints — obiekt gdzie każda wartość to async funkcja

type ApiEndpoints = {
    [key: string]: (...args: any[]) => Promise<any>
}

// Typ EndpointResults<T extends ApiEndpoints> —
// mapped type który dla każdego klucza wyciąga typ zwracany przez AsyncReturnType


type EndpointResults<T extends ApiEndpoints> = {
    [K in keyof T]:AsyncReturnType<T[K]>
}


type FormState<T> = {
    values: { [K in keyof T]: string };
    errors: { [K in keyof T]: string | undefined };
    touched: { [K in keyof T]: boolean };
}

// Napisz hook useForm<T> który:
//
// przyjmuje initialValues: T
// zwraca FormState<T> który pisałeś wcześniej plus metody:
//
//     setValue(key: keyof T, value: string): void
//     setError(key: keyof T, error: string | undefined): void
//     setTouched(key: keyof T): void
//     reset(): void



const useForm = <T,>(initialValues: T): FormState<T> & {
    setValue(key: keyof T, value: string): void;
    setError(key: keyof T, error: string | undefined): void;
    setTouchedHandler(key: keyof T): void;
    reset(): void;
} => {

    const[values,setValues] = useState<{ [K in keyof T]: string }>(Object.fromEntries(
        Object.entries(initialValues as object).map(([k]) => [k, ''])
    ) as { [K in keyof T]: string })
    const[errors,setErrors] = useState<{ [K in keyof T]: string |undefined}>(Object.fromEntries(Object.entries(initialValues as object).map(([k])=>[k,undefined])) as {[K in keyof T]: string|undefined})
    const[touched,setTouched] = useState<{ [K in keyof T]: boolean }>(
       Object.fromEntries( Object.entries(initialValues as object).map(([k])=> [k,false])) as {[K in keyof T]: boolean}
    )

    const setValue = (key: keyof T, value: string) => {
        setValues(prev => ({ ...prev, [key]: value }));
    }


    const setError = (key: keyof T, error: string|undefined) => {
        setErrors(prev => ({ ...prev, [key]: error }));
    }

    const setTouchedHandler = (key: keyof T, ) => {
        setTouched(prev => ({ ...prev, [key]: true }));
    }

    const reset=()=>{
        setValues(Object.fromEntries(Object.entries(initialValues as object).map(([k])=>[k,''])) as {[K in keyof T]: string})
setErrors(Object.fromEntries(Object.entries(initialValues as object).map(([k])=> [k,undefined])) as {[K in keyof T]: string|undefined})

        setTouched(Object.fromEntries(Object.entries(initialValues as object).map(([k])=> [k, false])) as {[K in keyof T]:boolean})
    }

    return {
        reset,setValue,setError,setTouchedHandler,values,errors,touched
    }
}







// masz interfejs
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: Date;
}


// Typ FilterByType<T, U> — zostają tylko pola gdzie wartość jest typu U

type FilteredByType<T,U> = { [K in keyof T as T[K] extends U ? K : never]: T[K] }

// Użyj go żeby wyciągnąć z User tylko pola które są string

type B = FilteredByType<User,string>


// Użyj go żeby wyciągnąć tylko pola które są number

type C = FilteredByType<User, number>



async function fetchUser2(id: number): Promise<User> { return {} as User; }
async function fetchProducts2(category: string, limit: number): Promise<Product[]> { return []; }
async function createOrder2(userId: number, products: number[]): Promise<{ id: number; total: number }> { return {} as any; }





// Typ UnwrapPromise<T> — wyciąga typ z Promise przez infer

type UnwrapPromise<T> = T extends Promise<infer U>? U:T

// Typ FunctionArgs<T> — wyciąga typy argumentów funkcji przez infer

type FunctionArgs<T> = T extends (...args: infer U) => any ? U : never


// Typ AsyncFunctionResult<T> — łączy oba — wyciąga typ z async funkcji po rozwiązaniu Promise

type AsyncFunctionResult<T> =T extends (...args: any[]) => infer R ? UnwrapPromise<R> : never






