function myMap<T, U>(arr: T[], cb: (el: T, i: number, arr: T[]) => U): U[] {
    const res: U[] = []
    for (let i = 0; i < arr.length; i++) {
        res.push(cb(arr[i], i, arr))
    }
    return res
}


//JS -----------------------------------------------------------------
//JS -----------------------------------------------------------------
// @ts-ignore
function myMap(arr, cb) {
    const res = []
    for (let i = 0; i < arr.length; i++) {
        res.push(cb(arr[i], i, arr))
    }
    return res
}

Array.prototype.myMap2 = function(cb) {
    const res = []
    for (let i = 0; i < this.length; i++) {
        res.push(cb(this[i], i, this))
    }
    return res
}

// T = typ wejścia, U = typ wyjścia. map przekształca T[] → U[] (np. number[] → string[]). Dlatego dwa generyki — wejście i wyjście mogą być różne.


function myFilter<T>(arr: T[], cb: (el: T, i: number, arr: T[]) => boolean): T[] {
    const res: T[] = []
    for (let i = 0; i < arr.length; i++) {
        if (cb(arr[i], i, arr)) res.push(arr[i])
    }
    return res
}


//JS -----------------------------------------------------------------
//JS -----------------------------------------------------------------
// @ts-ignore
function myFilter(arr, cb) {
    const res = []
    for (let i = 0; i < arr.length; i++) {
        if (cb(arr[i], i, arr)) res.push(arr[i])
    }
    return res
}

// Jeden generyk T — filter nie zmienia typu (zwraca podzbiór tego samego), więc wejście i wyjście to T[]. Callback zwraca boolean.


function myReduce<T, U>(
    arr: T[],
    cb: (acc: U, el: T, i: number, arr: T[]) => U,
    initial: U
): U {
    let acc = initial
    for (let i = 0; i < arr.length; i++) {
        acc = cb(acc, arr[i], i, arr)
    }
    return acc
}


//JS -----------------------------------------------------------------
//JS -----------------------------------------------------------------
// @ts-ignore
function myReduce(arr, cb, initial) {
    let acc = initial
    let start = 0
    if (arguments.length < 3) {   // brak initial → pierwszy element jako start
        acc = arr[0]
        start = 1
    }
    for (let i = start; i < arr.length; i++) {
        acc = cb(acc, arr[i], i, arr)
    }
    return acc
}

// T = element tablicy, U = typ akumulatora/wyniku (mogą się różnić — np. suma number[] → number, ale grupowanie T[] → obiekt).
// Tu wymagam initial (prostsze typowanie).
// Wersja bez initial jest trudniejsza typowo (overloady) — na LC wspomnij, że pełny reduce ma warianty z i bez initial.