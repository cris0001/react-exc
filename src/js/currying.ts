// ============================================================
// CURRYING & PIPE
// Przekształcanie funkcji wieloargumentowych w łańcuchy
// ============================================================


// ------------------------------------------------------------
// curry
// Przekształca funkcję (a, b) => c w (a) => (b) => c
// a żyje w closure wewnętrznej funkcji
//
// Typy:
// <A, B, C> — 3 generyki bo znamy dokładnie 2 argumenty i return
// (fn: (a: A, b: B) => C) — fn przyjmuje A i B, zwraca C
// : (a: A) => (b: B) => C — curry zwraca funkcję zwracającą funkcję
// ------------------------------------------------------------
function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
    return (a: A) => (b: B) => fn(a, b)
}

const add = curry((a: number, b: number) => a + b)
add(2)(3)   // 5
add(10)(5)  // 15

const add10 = add(10)  // funkcja czekająca na drugi argument
add10(5)    // 15
add10(3)    // 13


// ------------------------------------------------------------
// pipe
// Łączy funkcje w potok — wynik jednej idzie do następnej
// fns żyje w closure zwracanej funkcji
//
// Typy:
// <T> — jeden generic bo wszystkie funkcje mają ten sam typ wejścia/wyjścia
// ...fns: ((arg: T) => T)[] — spread, tablica funkcji T→T
// : (arg: T) => T — pipe zwraca nową funkcję T→T
// ------------------------------------------------------------
function pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
    return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg)
}

const transform = pipe(
    (x: number) => x * 2,
    (x: number) => x + 1,
    (x: number) => x * 3,
)
transform(5)
// 5 * 2 = 10
// 10 + 1 = 11
// 11 * 3 = 33