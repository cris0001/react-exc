import { useCartStore, selectTotalItems, selectTotalPrice } from "../store/cartStore"

// NAJWAŻNIEJSZA RZECZ W ZUSTANDZIE: SELEKTORY.
//
// Komponent re-renderuje się TYLKO gdy zmieni się to, co wyselekcjonował.
// To główna przewaga nad Contextem (tam każda zmiana value = re-render
// WSZYSTKICH konsumentów, bo brak selektorów).

export function CartSummary() {
  // ✅ DOBRZE — subskrybujesz tylko wyliczone wartości
  const totalItems = useCartStore(selectTotalItems)
  const totalPrice = useCartStore(selectTotalPrice)

  // ❌ ŹLE — bierzesz CAŁY stan -> re-render przy KAŻDEJ zmianie w store
  // const state = useCartStore()

  // ❌ ŹLE — nowy obiekt co render -> nieskończony re-render
  // const { items, clear } = useCartStore((s) => ({ items: s.items, clear: s.clear }))
  // (jeśli musisz kilka pól naraz -> useShallow, patrz niżej)

  return (
    <div>
      <p>Produktów: {totalItems}</p>
      <p>Razem: {totalPrice.toFixed(2)} zł</p>
    </div>
  )
}
