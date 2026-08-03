import {CartItem} from "@/lc/ui/cart-red-opt/cartReducer";
import {Product} from './Cart.tsx'

export function addOrIncrement(items: CartItem[], product: Product): CartItem[] {
    const exists = items.find(el => el.id === product.id)
    if (exists) {
        return items.map(item =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
    }
    return [...items, { ...product, qty: 1 }]
}