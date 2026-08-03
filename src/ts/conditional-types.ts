// Typ IsString<T> — zwraca true jeśli T to string, false jeśli nie

type IsString<T>=  T extends string ? true : false;

// Typ Flatten<T> — jeśli T to tablica zwraca typ elementu, jeśli nie — zwraca T

type Flatten<T> = T extends Array<infer U> ? U : T;

// Typ NonNullable<T> — własna implementacja, usuwa null i undefined z uniona

type NonNullablee<T> = T extends null | undefined ? never : T;


// Typ OnlyStrings<T> — filtruje union, zostają tylko stringi

type OnlyStrings<T> = T extends string ? T : never;




// napisz typ ExtractPromise<T> który wyciąga typ z Promise:
type ExtractPromise<T> = T extends Promise<infer U> ? U : T


    type A = ExtractPromise<Promise<User>>;
type B = ExtractPromise<Promise<string>>;
type C = ExtractPromise<string>;