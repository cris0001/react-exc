import {useSyncExternalStore} from "react"

// ============================================================
// PROSTY ZEWNĘTRZNY STORE (poza Reactem — zwykły obiekt JS)
// ============================================================

let count = 0
const listeners = new Set<() => void>()

const counterStore = {
    // odczyt aktualnej wartości
    getSnapshot: () => count,

    // zapis + powiadomienie subskrybentów
    increment: () => {
        count++
        listeners.forEach((l) => l())   // powiadom React, że coś się zmieniło
    },

    // subskrypcja — React się tu zapisuje
    subscribe: (listener: () => void) => {
        listeners.add(listener)
        return () => listeners.delete(listener)   // funkcja odsubskrybowania
    },
}

// ============================================================
// HOOK — podpina React do store'u
// ============================================================
function useCounter() {
    return useSyncExternalStore(
        counterStore.subscribe,     // jak się zapisać na zmiany
        counterStore.getSnapshot     // jak odczytać aktualną wartość
    )
}

// ============================================================
// UŻYCIE — dwa NIEZALEŻNE komponenty, wspólny stan
// ============================================================
function Display() {
    const count = useCounter()
    return <p>Licznik: {count}</p>
}

function Button() {
    return <button onClick={counterStore.increment}>+1</button>
}

function App() {
    return (
        <>
            <Display/>
            <Display/> {/* oba pokazują TĘ SAMĄ wartość — wspólny store */}
            <Button/>
        </>
    )
}