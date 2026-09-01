import {create} from "zustand";
import {immer} from "zustand/middleware/immer";


type CartItem = {
    id: number
    name: string
    price: number
    qty: number      // ilość w koszyku
}


type CartStore = {
    items: CartItem[]                          // stan
    addToCart: (product: Product) => void      // dodaj (jeśli jest → +qty)
    removeFromCart: (id: number) => void       // usuń
    changeQty: (id: number, delta: number) => void   // +/− ilość
    getTotal: () => number                     // suma (używa get)
    getCount: () => number                     // liczba sztuk (używa get)
}


type Product = {
    id: number
    name: string
    price: number
}

export const useCartStore = create<CartStore>()(immer((set, get) => ({
    items: [],

    addToCart: (product) => set((state) => {
        const existing = state.items.find((i: CartItem) => i.id === product.id)
        if (existing) {
            return { items: state.items.map((i: CartItem) =>
                    i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                )}
        }
        return { items: [...state.items, { ...product, qty: 1 }] }
    }),

    removeFromCart: (id) => set((state) => ({
        items: state.items.filter((i: CartItem) => i.id !== id)
    })),

    changeQty: (id, delta) => set((state) => ({
        items: state.items
            .map((i: CartItem) => i.id === id ? { ...i, qty: i.qty + delta } : i)
            .filter((i: CartItem) => i.qty > 0)   // usuń jeśli qty spadnie do 0
    })),

    getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

    getCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
})))