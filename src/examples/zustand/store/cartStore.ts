import { create } from "zustand"
import type { CartItem, Product } from "../types/cart"

// STORE = stan + akcje w JEDNYM obiekcie (inaczej niż Redux: zero reducerów,
// zero action types, zero dispatch).
//
// Pod spodem: zwykły obiekt JS poza Reactem + Set listenerów + useSyncExternalStore.
// Dlatego stan jest dostępny TEŻ spoza komponentów (patrz na dole).

type CartState = {
  // --- stan ---
  items: CartItem[]

  // --- akcje (mutują stan przez set) ---
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (product) =>
    // set z funkcją -> dostajesz aktualny stan (jak setState(prev => ...))
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id)

      // już w koszyku -> zwiększ ilość (NIE mutuj, twórz nową tablicę!)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }

      // nowy produkt -> dodaj z quantity 1
      return { items: [...state.items, { ...product, quantity: 1 }] }
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),

  // set bez funkcji -> podajesz nowy fragment stanu wprost
  clear: () => set({ items: [] }),
}))

// ============================================================
// SELEKTORY — funkcje wyliczające dane ze stanu.
// Trzymaj je OBOK store'a, żeby nie duplikować logiki w komponentach.
// ============================================================

export const selectTotalItems = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0)

export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

// ============================================================
// DOSTĘP SPOZA KOMPONENTU (czego nie da context!)
// ============================================================
// useCartStore.getState().addItem(product)   <- z dowolnego pliku, bez hooka
// useCartStore.getState().items              <- odczyt bez subskrypcji
// useCartStore.subscribe((s) => console.log(s.items))
