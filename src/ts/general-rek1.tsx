// Masz 3 rodzaje notyfikacji:
// - "email" → ma pole: to (string), subject (string), body (string)
// - "push"  → ma pole: deviceId (string), title (string), payload (unknown)
// - "sms"   → ma pole: phone (string), message (string)

// Napisz:
// 1. Discriminated union `Notification`
// 2. Funkcję `send(n: Notification): string` która zwraca:
//    - dla email: "Sending email to {to}"
//    - dla push:  "Pushing to device {deviceId}"
//    - dla sms:   "Texting {phone}"
//    TS ma pilnować że obsłużyłeś wszystkie przypadki (exhaustive check)


import {useEffect, useState} from "react";

type Notificationn =
    | {type:'email', to:string, subject:string,body:string}
    | {type:'push', deviceId:string, title:string, payload:unknown}
    | {type: 'sms', phone:string, message:string}


function send(n:Notificationn ){

    switch(n.type){
        case 'email': return `Send eail to ${n.to}`
        case 'push': return `Pushing to device ${n.deviceId}`
        case 'sms': return `Texting ${n.phone}`
        default:
            const x:never = n
            return x
    }
}


// Napisz generic type Result<T> — discriminated union sukcesu i błędu
// Następnie wytypuj funkcję fetchUser(id: number) która zwraca Result<User>
// i obsłuż oba przypadki z exhaustive checkiem

type Result<T> =
    | {type:'success',data:T}
    | {type:'error', message:string}

type Userr = { id: number; name: string }

async function fetchUser<T>(id:number):Promise<Result<T>>{

    try{
        const res = await new Promise<Result<T>>((resolve)=> resolve({ type: 'success', data: { id: 1, name: "John" } } as Result<T>) )
        return res

    }catch{
        return {type:'error', message:'blad'}
    }

}

// 3333333333333333333333333

type User2 = {
    id: number
    name: string
    password: string
    role: 'admin' | 'user'
}

// 1. SafeUser   — User bez password, użyj w funkcji getUser(): SafeUser

type SafeUser = Omit<User2,'password'>

function getUser(): SafeUser{
    return {} as SafeUser
}

// 2. UpdateUser — wszystkie pola opcjonalne oprócz id, użyj w updateUser(id, data)

type UpdateUserr= Pick<User2,'id'> & Partial<Omit<User2,'id'>>

function updateUser(id:UpdateUserr['id'],data:UpdateUserr){

}

// 3. UserPreview — tylko id i name, użyj w listUsers(): UserPreview[]

type UserPrevieww = Pick<User2,'id'|'name'>


function listUsers():UserPrevieww[]{

    return []as UserPrevieww[]
}


// 4444444444444444444444
// Mapped types — własna implementacja.


// Napisz własny typ Nullable<T> który każde pole opakuje w typ | null
// Wynik dla User:
// { id: number | null; name: string | null; role: 'admin' | 'user' | null }

type Nullable<T> = {[K in keyof T]: T[K] | null}


// Następnie napisz typ NonNullableFields<T> który robi odwrotność —
// usuwa null z każdego pola


type NonNullableFields<T>= {[K in keyof T]:NonNullable<T[K]>}
type NonNullableFields2<T> = { [K in keyof T]: T[K] extends null ? never : T[K] }



// 555555555555555555
// Template literal types.


type Entity = 'user' | 'post' | 'comment'

// 1. Napisz typ EventName który generuje wszystkie kombinacje:
// 'user:created' | 'user:updated' | 'user:deleted' |
// 'post:created' | ... itd.

type Actions = 'created' | 'updated'|'deleted'

type EventName= `${Entity}:${Actions}`


// 2. Napisz typ Getters<T> który dla danego typu generuje gettery:
// dla User → { getId: () => number, getName: () => string, getRole: () => ... }


type Getters<T> ={[K in keyof T as `get${Capitalize<string & K>}`]: ()=> T[K]}


// 66666666666666666666666
// Branded types.


// Masz funkcję która transferuje pieniądze.
// Problem: UserId i AccountId to oba number — łatwo pomylić.

function transfer(from: number, to: number, amount: number) {}

// 1. Napisz typ Brand<T, B>

type Brandd<T,B> = T & {__brand:B}

// 2. Stwórz UserId, AccountId, Amount

type UserId = Brandd<number, 'UserId'>
type AccountId = Brandd<number, 'AccountId'>
type Amount = Brandd<number, 'Amount'>

// 3. Przepisz sygnaturę transfer

function transfer2(from: UserId, to: AccountId, amount: Amount) {}


// 4. Napisz smart constructor dla Amount który rzuca błąd gdy amount <= 0

function createAmount(x:number):Amount{
    if(x <= 0) throw new Error('blad')
    return x as Amount
}

// 7777777777777777777777777

// Napisz generic hook useFetch<T> który:
// 1. przyjmuje url: string
// 2. zwraca { data: T | null, loading: boolean, error: string | null }
// 3. stan jako discriminated union (nie 3 osobne stany)
// 4. funkcja musi być typebezpieczna — wywołujący decyduje co to T


type State<T>=
    | {status:"loading"}
    | {status: 'success', data:T}
    | {status:'error', message:string}



function useFetch<T>({url}:{url:string}){

const [state, setState] = useState<State<T>>({
    status:'loading'
})

    useEffect(() => {
        fetch(url)
            .then(r => r.json())
            .then(data => setState({ status: 'success', data }))
            .catch(e => setState({ status: 'error', message: e.message }))
    }, [url])


    return {
        data: state.status === 'success' ? state.data : null,
        loading: state.status === 'loading',
        error: state.status === 'error' ? state.message : null,
    }

}

//888888888888888888888888
// conditional types + infer.


// 1. Napisz typ Flatten<T> który:
//    - dla T[] zwraca T
//    - dla Promise<T> zwraca T
//    - dla reszty zwraca T bez zmian

type Flatten<T> = T extends Array<infer U> ? U : T extends Promise<infer U>? U: T;



// 2. Napisz typ FunctionArgs<T> który wyciąga typy argumentów funkcji
//    (własna implementacja Parameters<T>)

type FunctionArgs<T> = T extends (...args:infer A)=>any? A :T



// 999999999999999999999
// generics, mapped types, conditional types.


// Napisz typ DeepReadonly<T> który rekurencyjnie robi wszystkie pola readonly
// dla prostych wartości (string, number, boolean) — zostawia je
// dla obiektów — robi readonly i schodzi głębiej
// dla tablic — robi readonly tablicę z DeepReadonly elementami

type Config = {
    db: {
        host: string
        port: number
        credentials: {
            user: string
            pass: string
        }
    }
    features: string[]
}



type DeepReadonly<T>= {readonly [K in keyof T]:T[K] extends object ? DeepReadonly<T[K]> : T[K]}





//1111111 1111111111

// Napisz klasę EventEmitter<Events> gdzie Events to mapa eventów i ich payloadów
//
// Użycie:
// const emitter = new EventEmitter<{
//   userCreated: { id: number; name: string }
//   orderPlaced: { orderId: number; amount: number }
// }>()
//
// emitter.on('userCreated', (payload) => {
//   payload.id   // number ✅
//   payload.xyz  // ❌ błąd TS
// })
//
// emitter.emit('userCreated', { id: 1, name: 'John' }) // ✅
// emitter.emit('userCreated', { orderId: 1 })          // ❌ błąd TS



class EventEmitter<Events>{


    listeners = new Map<keyof Events, Array<(payload:any)=>void>>()

    on<K extends keyof Events>(action:K, cb: (x:Events[K])=>void){
        const existing = this.listeners.get(action)
        if(existing) this.listeners.set(action,[...existing,cb])
        else this.listeners.set(action,[cb])
    }

    emit<K extends keyof Events>(action:K, payload:Events[K]){
        this.listeners.get(action)?.forEach(cb => cb(payload))
    }

}



// 11111111 22222222222
// Builder pattern. - type-safe query builder.


// Klasa QueryBuilder<T> gdzie T to typ encji
//
// Użycie:
// const query = new QueryBuilder<User>()
//   .select('id', 'name')      // tylko pola które istnieją w User
//   .where('id', 1)            // klucz musi być z User, wartość musi pasować do typu
//   .limit(10)
//   .build()                   // zwraca { select, where, limit }
//
// .select('xyz')               // ❌ błąd TS
// .where('id', 'not-a-number') // ❌ błąd TS


class QueryBuilder<T>{

    private selectFields: Array<keyof T> = []
    private whereClause: Partial<T> = {}
    private limitValue: number | null = null

    select(...args :Array<keyof T>){
     this.selectFields=args
        return this
    }

    where<K extends keyof T>(key: K, value: T[K]) {
        // this.whereClause= {[key]:value}
        this.whereClause = { ...this.whereClause, [key]: value }
        return this
    }

    limit(x:number|null){
       this.limitValue = x
        return this
    }
    build(){
        return {select:this.selectFields, where:this.whereClause, limit:this.limitValue}
    }

}




type User = { id: number; name: string;  }



// 1111111 3333333
// type-safe API client.

//  Typ ApiClient który wiąże endpoint z request i response typem
//
// Użycie:
// const client = createApiClient({
//   getUser:    { method: 'GET',  path: '/users/:id',  response: User },
//   createUser: { method: 'POST', path: '/users',      body: CreateUser, response: User },
//   deleteUser: { method: 'DELETE', path: '/users/:id', response: void },
// })
//
// client.getUser({ id: 1 })           // zwraca Promise<User>
// client.createUser({ name: 'John' }) // zwraca Promise<User>
// client.getUser({ name: 'xyz' })     // ❌ błąd TS


type Methods<T> =
    | { method: 'GET';    path: string; response: T }
    | { method: 'POST';   path: string; body: any; response: T }
    | { method: 'DELETE'; path: string; response: void }

// Wyciąga typ response z definicji endpointu
type GetResponse<T> = T extends Methods<infer R> ? R : never

// Wyciąga typ body z definicji endpointu
type GetBody<T> = T extends { body: infer B } ? B : never

// Typ klienta — dla każdego klucza z T tworzy funkcję
type ApiClientType<T extends Record<string, Methods<any>>> = {
    [K in keyof T]: GetBody<T[K]> extends never
        ? () => Promise<GetResponse<T[K]>>
        : (body: GetBody<T[K]>) => Promise<GetResponse<T[K]>>
}

function createApiClient<T extends Record<string, Methods<any>>>(
    endpoints: T
): ApiClientType<T> {
    const client = {} as ApiClientType<T>

    for (const key in endpoints) {
        const endpoint = endpoints[key]
        client[key] = ((body?: any) =>
            fetch(endpoint.path, {
                method: endpoint.method,
                body: body ? JSON.stringify(body) : undefined,
            }).then(r => r.json())) as any
    }

    return client
}

// Użycie

type CreateUser = { name: string }

const client = createApiClient({
    getUser:    { method: 'GET',    path: '/users/1',  response: {} as User },
    createUser: { method: 'POST',   path: '/users',    body: {} as CreateUser, response: {} as User },
    deleteUser: { method: 'DELETE', path: '/users/1',  response: undefined },
})

client.getUser()                  // Promise<User> ✅
client.createUser({ name: 'John' }) // Promise<User> ✅






// 1111 44444
// repository pattern z typami.


// generic interfejs Repository<T> i implementację UserRepository
//
// Repository<T> musi mieć:
// - findById(id: number): Promise<T | null>
// - findAll(): Promise<T[]>
// - create(data: Omit<T, 'id'>): Promise<T>
// - update(id: number, data: Partial<Omit<T, 'id'>>): Promise<T | null>
// - delete(id: number): Promise<boolean>
//
// Następnie napisz klasę UserRepository implements Repository<User>



type Repository<T>={
    findById(id: number): Promise<T | null>
    findAll(): Promise<T[]>
    create(data: Omit<T, 'id'>): Promise<T>
    update(id: number, data: Partial<Omit<T, 'id'>>): Promise<T | null>
    delete(id: number): Promise<boolean>
}



class UserRepository implements Repository<User>{

    private users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Anna' },
    ]

    async findById(id: number): Promise<User | null> {
        return this.users.find(u => u.id === id) ?? null
    }


    async findAll():Promise<User[]>{
        return this.users
    }

    async create(data: Omit<User, 'id'>): Promise<User>{
       this.users.push({id:Date.now(), name:data.name})
        return {id:3, name:data.name}
    }

    async update(id: number, data: Partial<Omit<User, 'id'>>): Promise<User | null> {
        const index = this.users.findIndex(u => u.id === id)
        if (index === -1) return null
        this.users[index] = { ...this.users[index], ...data }
        return this.users[index]
    }
    async delete(id: number): Promise<boolean> {
        const index = this.users.findIndex(u => u.id === id)
        if (index === -1) return false
        this.users.splice(index, 1)
        return true
    }


}





























