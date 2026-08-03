// Czysta logika koszyka — zero Reacta.
// Reducer to (state, action) => newState, więc jest IDEALNY do unit testów:
// wejście -> wyjście, bez renderowania i mockowania.

export type Product = {
    id: number
    name: string
    price: number
}

export type CartItem = Product & { quantity: number }

export type CartState = CartItem[]

// DISCRIMINATED UNION — pole `type` rozróżnia warianty.
// Dzięki temu TS wie, że przy "ADD" jest payload: Product,
// a przy "CLEAR" nie ma payloadu wcale.
export type CartAction =
    | { type: "ADD"; payload: Product }
    | { type: "REMOVE"; payload: { id: number } }
    | { type: "INCREMENT"; payload: { id: number } }
    | { type: "DECREMENT"; payload: { id: number } }
    | { type: "CLEAR" }

export const initialState: CartState = []

export function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {

        case "ADD": {
            const existing = state.find((item) => item.id === action.payload.id)

            // już jest w koszyku -> zwiększ ilość (bez duplikowania pozycji)
            if (existing) {
                return state.map((item) =>
                    item.id === action.payload.id
                        ? {...item, quantity: item.quantity + 1}   // NOWY obiekt, nie mutacja
                        : item
                )
            }

            // nowy produkt -> dodaj z ilością 1
            return [...state, {...action.payload, quantity: 1}]
        }

        case "REMOVE":
            return state.filter((item) => item.id !== action.payload.id)

        case "INCREMENT":
            return state.map((item) =>
                item.id === action.payload.id
                    ? {...item, quantity: item.quantity + 1}
                    : item
            )

        case "DECREMENT":
            return state
                .map((item) =>
                    item.id === action.payload.id
                        ? {...item, quantity: item.quantity - 1}
                        : item
                )
                // po zmniejszeniu do 0 -> wyrzuć pozycję z koszyka
                .filter((item) => item.quantity > 0)

        case "CLEAR":
            return []

        default:

            // TS pilnuje, że obsłużyliśmy wszystkie warianty.
            // Gdyby doszedł nowy typ akcji bez case'a -> błąd kompilacji tutaj.
            const _exhaustive: never = action   // błąd kompilacji, gdy dojdzie nowa akcja bez case'a

            return state
    }
}

// SELEKTOR — pochodna stanu, liczona z koszyka.
// Nie trzymamy sumy w stanie (byłaby duplikacja + ryzyko rozjazdu).
export function selectTotal(items: CartState): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}