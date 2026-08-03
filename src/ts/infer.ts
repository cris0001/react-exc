// Typ UnpackArray<T> — wyciąga typ elementu z tablicy

type UnpackArray<T> = T extends Array<infer U> ? U : never;


// Typ UnpackPromise<T> — wyciąga typ z Promise

type UnpackPromise<T> = T extends Promise<infer U >? U : never;


// Typ FirstArgument<T> — wyciąga typ pierwszego argumentu funkcji

type FirstArgument<T>= T extends (first:infer U, ...arr:any[])=> any? U:never

// Typ UnpackRecord<T> — wyciąga typ wartości z obiektu

type UnpackRecord<T> = T extends Record<string, infer V> ? V : never;




async function fetchUserr(id: number): Promise<User> {
    return {} as User;
}

async function fetchProducts(category: string, limit: number): Promise<Product[]> {
    return [] as Product[];
}

// Typ UnpackAsync<T> — wyciąga typ z async funkcji (bez Awaited i ReturnType — użyj infer)

type UnpackAsync<T> = T extends (...args:any[])=> Promise<infer U>? U:never

// Użyj UnpackAsync na obu funkcjach

type FetchUser = UnpackAsync<typeof fetchUserr>
type fetchProducts = UnpackAsync<typeof fetchProducts>