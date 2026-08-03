// Własny MyPartial<T> — wszystkie pola opcjonalne

type MyPartial<T> = { [K in keyof T]?: T[K] };


// Własny MyReadonly<T> — wszystkie pola readonly

type MyReadonly<T> = { readonly [K in keyof T]: T[K] };


// Typ Stringify<T> — zmienia wszystkie pola na string

type Stringify<T> = {[K in keyof T]:string}


// Typ StringKeys<T> — zostają tylko pola gdzie wartość to string
type StringKeys<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K]}



//Typ Optional<T, K extends keyof T> — tylko podane pola K opcjonalne, reszta wymagana

type Optionall<T, K extends keyof T> =  Omit<T, K> & Partial<Pick<T, K>>;



// Typ Getters<T> — dla każdego pola tworzy metodę getX która zwraca typ pola


type Getters2<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
    //                  ↑ template literal type — dodaje 'get' przed nazwą klucza
    //                         ↑ Capitalize — pierwsza litera wielka
    //                                    ↑ string & K — K musi być stringiem
}

// Typ Nullable<T> — każde pole może być null

type Nullablee<T> = {
    [K in keyof T]: T[K] | null
}



//Typ EventHandlers<T> — dla każdego pola tworzy onChangeX gdzie X to nazwa pola z wielką literą, każdy handler przyjmuje nową wartość tego pola

type EventHandlers2<T> ={
    [K in keyof T as `onChange${Capitalize<string & K>}`]:(value: T[K])=> void
}




//Typ FormValues<T> — każde pole staje się string (bo inputy zwracają stringi)

type FormValues<T>= {[K in keyof T]:string}


// /Typ FormErrors<T> — każde pole staje się string | undefined (błąd walidacji lub brak)

type FormErrors<T> = {[K in keyof T]:string|undefined}

//Typ FormTouched<T> — każde pole staje się boolean (czy pole było dotknięte)


type FormTouched<T> = {[K in keyof T]:boolean}