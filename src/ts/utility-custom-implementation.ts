// Partial — wszystkie pola opcjonalne, przydatne przy update/patch
// MyPartial<{id: number, name: string}> = {id?: number, name?: string}
type MyPartiall<T> = { [K in keyof T]?: T[K] }

// Required — wszystkie pola wymagane, usuwa ? z opcjonalnych
// MyRequired<{id?: number, name?: string}> = {id: number, name: string}
type MyRequired<T> = { [K in keyof T]-?: T[K] }

// Readonly — wszystkie pola readonly, nie można modyfikować
// MyReadonly<{id: number}> = {readonly id: number}
type MyReadonlyy<T> = { readonly [K in keyof T]: T[K] }

// Mutable — usuwa readonly, można znów modyfikować
// MyMutable<{readonly id: number}> = {id: number}
type MyMutable<T> = { -readonly [K in keyof T]: T[K] }

// Pick — wybiera tylko podane klucze z T
// MyPick<{id: number, name: string, email: string}, 'id' | 'name'> = {id: number, name: string}
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }

// Omit — usuwa podane klucze z T, zostaje reszta
// MyOmit<{id: number, name: string, email: string}, 'email'> = {id: number, name: string}
type MyOmit<T, K extends keyof T> = { [P in keyof T as Exclude<P, K>]: T[P] }

// Record — tworzy obiekt z kluczami K i wartościami V
// MyRecord<'a' | 'b', number> = {a: number, b: number}
type MyRecord<K extends string | number | symbol, V> = { [P in K]: V }

// Exclude — usuwa z union typy które pasują do U
// MyExclude<'a' | 'b' | 'c', 'b'> = 'a' | 'c'
type MyExclude<T, U> = T extends U ? never : T

// Extract — zostawia w union tylko typy które pasują do U
// MyExtract<'a' | 'b' | 'c', 'a' | 'b'> = 'a' | 'b'
type MyExtract<T, U> = T extends U ? T : never

// NonNullable — usuwa null i undefined z typu
// MyNonNullable<string | null | undefined> = string
type MyNonNullable<T> = T extends null | undefined ? never : T

// ReturnType — wyciąga typ zwracany przez funkcję
// MyReturnType<() => string> = string
type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never

// Parameters — wyciąga typy parametrów funkcji jako tuple
// MyParameters<(a: string, b: number) => void> = [string, number]
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never

// Awaited — rekurencyjnie rozpakowuje Promise do końcowego typu
// MyAwaited<Promise<Promise<string>>> = string
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T

// InstanceType — wyciąga typ instancji z konstruktora klasy
// MyInstanceType<typeof User> = User
type MyInstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : never

// ConstructorParameters — wyciąga typy parametrów konstruktora klasy
// MyConstructorParameters<typeof User> = [string, number]
type MyConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never

// FirstArg — wyciąga typ pierwszego argumentu funkcji
// MyFirstArg<(a: string, b: number) => void> = string
type MyFirstArg<T extends (...args: any[]) => any> = T extends (first: infer F, ...args: any[]) => any ? F : never

// LastArg — wyciąga typ ostatniego argumentu funkcji
// MyLastArg<(a: string, b: number) => void> = number
type MyLastArg<T extends (...args: any[]) => any> = T extends (...args: infer A) => any ? A extends [...any[], infer L] ? L : never : never

// UnpackArray — wyciąga typ elementu z tablicy
// MyUnpackArray<string[]> = string
type MyUnpackArray<T> = T extends Array<infer U> ? U : T

// DeepPartial — rekurencyjnie robi wszystkie pola opcjonalne
// MyDeepPartial<{id: number, address: {city: string}}> = {id?: number, address?: {city?: string}}
type MyDeepPartial<T> = { [K in keyof T]?: T[K] extends object ? MyDeepPartial<T[K]> : T[K] }

// DeepReadonly — rekurencyjnie robi wszystkie pola readonly
// MyDeepReadonly<{id: number, address: {city: string}}> = {readonly id: number, readonly address: {readonly city: string}}
type MyDeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? MyDeepReadonly<T[K]> : T[K] }

// Nullable — dodaje null do każdego pola
// MyNullable<{id: number, name: string}> = {id: number | null, name: string | null}
type MyNullable<T> = { [K in keyof T]: T[K] | null }

// ValueOf — union wszystkich wartości obiektu
// MyValueOf<{id: number, name: string}> = number | string
type MyValueOf<T> = T[keyof T]

// KeysOfType — union kluczy gdzie wartość jest danego typu
// MyKeysOfType<{id: number, name: string, age: number}, number> = 'id' | 'age'
type MyKeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T]