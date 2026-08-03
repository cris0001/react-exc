import {CartItem} from "@/lc/ui/cart-red-opt/cartReducer.ts";
import {addOrIncrement} from "@/lc/ui/cart-red-opt/cartLogic.ts";
import {Product} from './Cart.tsx'

export async function addToCart(product: Product, cart: CartItem[]): Promise< CartItem[] > {

    await new Promise((r) => setTimeout(r, 600))

    if (Math.random() < 0.3) {
        throw new Error("Nie udało się dodać do koszyka")
    }

    return addOrIncrement(cart, product)

}