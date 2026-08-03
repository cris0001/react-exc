import { useShallow } from "zustand/react/shallow"
import { useCartStore } from "../store/cartStore"

// Gdy potrzebujesz KILKU pól naraz -> useShallow.
// Bez niego selektor zwraca nowy obiekt co render -> nieskończona pętla.
// useShallow porównuje płytko (per klucz) zamiast po referencji.

export function CartList() {
  const { items, removeItem, updateQuantity } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
    }))
  )

  if (items.length === 0) return <p>Koszyk pusty</p>

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name} — {item.price} zł
          <input
            type="number"
            value={item.quantity}
            min={1}
            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
          />
          <button onClick={() => removeItem(item.id)}>Usuń</button>
        </li>
      ))}
    </ul>
  )
}
