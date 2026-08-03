// ============================================================
// CLOSURE — zadania z dzisiaj
// ============================================================


// ------------------------------------------------------------
// makeHistory
// Trzyma tablicę wartości
// add(value) — dodaje wartość
// undo() — usuwa ostatnią wartość
// getAll() — zwraca wszystkie wartości
// ------------------------------------------------------------
function makeHistory() {
    let values: string[] = []

    return {
        add: (value: string) => values.push(value),
        undo: () => values.pop(),
        getAll: () => values
    }
}

const hstry = makeHistory()
hstry.add('krok 1')
hstry.add('krok 2')
hstry.getAll()  // ['krok 1', 'krok 2']
hstry.undo()    // usuwa 'krok 2'
hstry.getAll()  // ['krok 1']


// ------------------------------------------------------------
// makeToggle
// Przyjmuje dwie wartości a i b
// Zwraca funkcję która naprzemiennie zwraca a i b
// isToggled żyje w closure
// ------------------------------------------------------------
function makeToggle(a: string, b: string) {
    let isToggled = false

    return () => {
        isToggled = !isToggled
        return isToggled ? a : b
    }
}

const toggle = makeToggle('on', 'off')
toggle()  // 'on'
toggle()  // 'off'
toggle()  // 'on'


// ------------------------------------------------------------
// makeIdGenerator
// Zwraca funkcję która przy każdym wywołaniu zwraca kolejne unikalne id
// idCounter żyje w closure
// ------------------------------------------------------------
function makeIdGenerator() {
    let idCounter = 0

    return () => {
        idCounter++
        return idCounter
    }
}

const getId = makeIdGenerator()
getId()  // 1
getId()  // 2
getId()  // 3


// ------------------------------------------------------------
// makeCache
// Przechowuje dane w Map (closure)
// set(key, value) — zapisuje
// get(key) — pobiera
// has(key) — sprawdza czy istnieje
// clear() — czyści cache
// ------------------------------------------------------------
function makeCache<T>() {
    const cacheStore = new Map<string, T>()

    return {
        set: (key: string, value: T) => cacheStore.set(key, value),
        get: (key: string) => cacheStore.get(key),
        has: (key: string) => cacheStore.has(key),
        clear: () => cacheStore.clear()
    }
}

const che = makeCache<{ name: string }>()
che.set('user', { name: 'Anna' })
che.has('user')  // true
che.get('user')  // { name: 'Anna' }
che.clear()
che.has('user')  // false


// ------------------------------------------------------------
// makeEventBus
// System zdarzeń — listeners żyją w closure
// on(event, fn) — subskrybuj zdarzenie
// off(event, fn) — odsubskrybuj
// emit(event, ...args) — wywołaj wszystkich listenerów
//
// listeners: Record<string, Function[]>
// klucz = nazwa eventu, wartość = tablica funkcji
// ------------------------------------------------------------
function makeEventBus() {
    let listeners: Record<string, Function[]> = {}

    return {
        on: (event: string, fn: Function) => {
            if (!listeners[event]) listeners[event] = []
            listeners[event].push(fn)
        },
        off: (event: string, fn: Function) => {
            listeners[event] = listeners[event]?.filter(el => el !== fn) ?? []
        },
        emit: (event: string, ...args: any[]) => {
            listeners[event]?.forEach(fn => fn(...args))
        }
    }
}

const bus = makeEventBus()
const handler3 = (msg: string) => console.log(msg)
bus.on('click', handler)
bus.emit('click', 'hello')  // "hello"
bus.off('click', handler)
bus.emit('click', 'hello')  // (nic)


// ------------------------------------------------------------
// makeStateMachine
// Przyjmuje stan początkowy i dozwolone przejścia
// getState() — zwraca aktualny stan
// transition(nextState) — zmienia stan tylko jeśli przejście dozwolone
//
// transitions: Record<string, string[]>
// klucz = aktualny stan, wartość = lista dozwolonych stanów
// includes() sprawdza czy przejście jest dozwolone
// ------------------------------------------------------------
function makeStateMachine(initialState: string, transitions: Record<string, string[]>) {
    let state = initialState

    return {
        getState: () => state,
        transition: (nextState: string) => {
            if (transitions[state].includes(nextState)) state = nextState
        }
    }
}

const machine = makeStateMachine('idle', {
    idle: ['running'],
    running: ['idle', 'paused'],
    paused: ['running', 'idle']
})

machine.getState()              // 'idle'
machine.transition('running')  // ✅ zmienia na 'running'
machine.transition('paused')   // ✅ zmienia na 'paused'
machine.transition('idle')     // ✅ zmienia na 'idle'
machine.transition('paused')   // ❌ ignoruje — z idle nie można do paused


// ------------------------------------------------------------
// makeRetryable
// Przyjmuje funkcję async i maxRetries
// Zwraca funkcję która próbuje wywołać fn max maxRetries razy
// Przy błędzie próbuje ponownie — try/catch w pętli for
// Po wyczerpaniu prób rzuca błąd
// ------------------------------------------------------------
function makeRetryable<T extends () => Promise<any>>(fn: T, maxRetries: number) {
    return async () => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const res = await fn()
                return res
            } catch {
                // próbuj dalej
            }
        }
        throw new Error(`Failed after ${maxRetries} retries`)
    }
}

const retryable = makeRetryable(async () => {
    // może rzucić błąd
}, 3)

await retryable()  // spróbuje max 3 razy


// ------------------------------------------------------------
// makePipeline
// Przyjmuje tablicę funkcji
// Zwraca funkcję która przepuszcza wartość przez wszystkie funkcje
// Jeśli jakaś funkcja zwróci null/undefined — przerywa i zwraca null
//
// current — aktualna wartość po poprzednich transformacjach
// for zamiast forEach — żeby móc przerwać przez return
// ------------------------------------------------------------
function makePipeline<T>(fns: ((x: T) => T | null)[]) {
    return (x: T) => {
        let current = x
        for (let i = 0; i < fns.length; i++) {
            const res = fns[i](current)
            if (!res) return null
            current = res
        }
        return current
    }
}

const pipeline = makePipeline([
    (x: number) => x * 2,
    (x: number) => x > 5 ? x : null,
    (x: number) => x + 1,
])

pipeline(1)   // null  — 1*2=2, 2 > 5? nie → null
pipeline(10)  // 21   — 10*2=20, 20 > 5 → 20, 20+1=21