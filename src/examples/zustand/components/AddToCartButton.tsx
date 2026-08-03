import { useCartStore } from "../store/cartStore"
import type { Product } from "../types/cart"

export function AddToCartButton({ product }: { product: Product }) {
  // Selektor po samej AKCJI — funkcje w Zustandzie są STABILNE
  // (ta sama referencja przez całe życie store'a).
  //
  // Efekt: ten komponent NIE re-renderuje się, gdy zmienią się items!
  // Subskrybuje tylko `addItem`, które nigdy się nie zmienia.
  const addItem = useCartStore((state) => state.addItem)

  return <button onClick={() => addItem(product)}>Dodaj do koszyka</button>
}
