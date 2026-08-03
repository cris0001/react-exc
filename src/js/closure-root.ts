// ============================================================
// CLOSURE — zmienna żyje między wywołaniami dzięki domknięciu
// Wzorzec: funkcja zewnętrzna tworzy zmienną → zwraca funkcję która ją używa
// ============================================================


// ------------------------------------------------------------
// makeAdder
// Przyjmuje x, zwraca funkcję która dodaje x do argumentu
// x żyje w closure
// ------------------------------------------------------------
function makeAdder(a: number): (b: number) => number {
    return (b) => a + b
}

const add5 = makeAdder(5)
add5(3)   // 8
add5(10)  // 15


// ------------------------------------------------------------
// makeMultiplier
// Przyjmuje x, zwraca funkcję która mnoży argument przez x
// ------------------------------------------------------------
function makeMultiplier(x: number): (a: number) => number {
    return (a: number) => x * a
}

const double = makeMultiplier(2)
const triple = makeMultiplier(3)
double(5)  // 10
triple(5)  // 15


// ------------------------------------------------------------
// makeLogger
// Przyjmuje prefix, zwraca funkcję logującą z prefixem
// counter żyje w closure — zlicza wywołania
// ------------------------------------------------------------
function makeLogger(prefix: string): (txt: string) => string {
    let counter = 0
    return (txt) => {
        counter++
        return `${prefix} ${txt} ${counter}`
    }
}

const logger = makeLogger('[INFO]')
logger('start')   // "[INFO] start 1"
logger('koniec')  // "[INFO] koniec 2"


// ------------------------------------------------------------
// makeTimer
// start() zapisuje czas, elapsed() zwraca ile ms minęło
// startTime żyje w closure
// ------------------------------------------------------------
function makeTimer() {
    let startTime = 0
    return {
        start: () => startTime = Date.now(),
        elapsed: () => Date.now() - startTime
    }
}

const timer = makeTimer()
timer.start()
timer.elapsed()  // np. 1523


// ------------------------------------------------------------
// makeRateLimiter
// Wykonuje fn maksymalnie limit razy, potem ignoruje
// count żyje w closure
// ------------------------------------------------------------
function makeRateLimiter(limit: number) {
    let count = 0
    return (fn: () => void) => {
        if (count < limit) {
            count++
            fn()
        }
    }
}

const limited = makeRateLimiter(3)
limited(() => console.log('wywołanie'))  // "wywołanie"
limited(() => console.log('wywołanie'))  // "wywołanie"
limited(() => console.log('wywołanie'))  // "wywołanie"
limited(() => console.log('wywołanie'))  // (ignorowane)


// ------------------------------------------------------------
// createLogger
// Trzyma historię logów w closure
// arr żyje między wywołaniami metod
// ------------------------------------------------------------
function createLogger() {
    let arr: string[] = []
    return {
        log: (value: string) => arr.push(value),
        getLogs: (): string[] => arr,
        clear: (): void => { arr = [] }
    }
}

const cLogger = createLogger()
cLogger.log('hello')
cLogger.log('world')
cLogger.getLogs()  // ['hello', 'world']
cLogger.clear()
cLogger.getLogs()  // []


// ------------------------------------------------------------
// myStack — stos (LIFO: Last In First Out)
// push / pop / peek / size
// items żyje w closure
// ------------------------------------------------------------
function myStack<T>() {
    const items: T[] = []
    return {
        push: (item: T) => items.push(item),
        peek: () => items[items.length - 1],  // ostatni bez usuwania
        pop: () => items.pop(),               // usuwa i zwraca ostatni
        size: () => items.length
    }
}

const stack = myStack<number>()
stack.push(1); stack.push(2); stack.push(3)
stack.peek()  // 3
stack.pop()   // 3
stack.size()  // 2


// ------------------------------------------------------------
// myQueue — kolejka (FIFO: First In First Out)
// enqueue / dequeue / front / size
// push dodaje na koniec, shift usuwa z początku
// ------------------------------------------------------------
function myQueue<T>() {
    const items: T[] = []
    return {
        enqueue: (i: T) => items.push(i),
        front: () => items[0],       // pierwszy bez usuwania
        dequeue: () => items.shift(), // usuwa i zwraca pierwszy
        size: () => items.length
    }
}

const queue = myQueue<number>()
queue.enqueue(1); queue.enqueue(2); queue.enqueue(3)
queue.front()    // 1
queue.dequeue()  // 1
queue.size()     // 2


// ------------------------------------------------------------
// memoize
// Zapamiętuje wyniki dla już widzianych argumentów
// cache (Map) żyje w closure między wywołaniami
// JSON.stringify(args) jako klucz — uwaga: kolejność kluczy w obiektach ma znaczenie
// ------------------------------------------------------------
function memoize<T extends (...args: any[]) => any>(fn: T) {
    const cache = new Map<string, ReturnType<T>>()

    return (...args: Parameters<T>): ReturnType<T> => {
        const key = JSON.stringify(args)
        if (cache.has(key)) return cache.get(key)!
        const result = fn(...args)
        cache.set(key, result)
        return result
    }
}


// ------------------------------------------------------------
// once
// Funkcja może być wywołana tylko raz
// Kolejne wywołania zwracają wynik pierwszego
// isCalled i fnRes żyją w closure
// ------------------------------------------------------------
function once<T extends (...args: any[]) => any>(fn: T): T {
    let isCalled = false
    let fnRes: ReturnType<T> | undefined = undefined

    return ((...args: Parameters<T>) => {
        if (!isCalled) {
            isCalled = true
            fnRes = fn(...args)
            return fnRes
        }
        return fnRes
    }) as T
}

const init = once((x: number) => {
    console.log('inicjalizuję!')
    return x * 2
})
init(5)  // "inicjalizuję!" → 10
init(3)  // (brak loga) → 10


// ------------------------------------------------------------
// debounce
// Opóźnia wywołanie fn o ms milisekund
// Każde nowe wywołanie resetuje timer
// Przydatne: input search, resize
// timer żyje w closure
// ------------------------------------------------------------
function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T {
    let timer: ReturnType<typeof setTimeout>

    return ((...args: any[]) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), ms)
    }) as T
}


// ------------------------------------------------------------
// throttle
// Ogranicza częstotliwość wywołań — max raz na ms milisekund
// Przydatne: scroll, mousemove
// lastCall żyje w closure
// ------------------------------------------------------------
function throttle<T extends (...args: any[]) => any>(fn: T, ms: number): T {
    let lastCall = 0

    return ((...args: any[]) => {
        const now = Date.now()
        if (now - lastCall >= ms) {
            lastCall = now
            return fn(...args)
        }
    }) as T
}