import {Product} from "@/lc/ui/cart2/Cart.tsx";
import { describe, it, expect } from 'vitest'
import {CartItem, cartReducer, initialState, totalItems} from "@/lc/ui/cart2/cartReducer.ts";

const CATALOG: Product[] = [
    { id: "a", name: "Kawa", price: 18 },
    { id: "b", name: "Herbata", price: 12 },
    { id: "c", name: "Ciastko", price: 8 },
    { id: "d", name: "Kanapka", price: 22 },
]


const CART: CartItem[] = CATALOG.map((el,i)=> ({...el,qty:i +1}))

describe('cartReducer', () => {

    it('ADD dodaje nowy produkt z qty 1', () => {
        const result = cartReducer(initialState, {
            type: 'ADD',
            payload: { product: CATALOG[0] }
        })
        expect(result.products).toHaveLength(1)
        expect(result.products[0].qty).toBe(1)
    })

    it('clears cart',()=>{
        const result = cartReducer({products: CART}, {type: "CLEAR"})
        expect(result.products).toHaveLength(0)
        expect(totalItems(result.products)).toEqual(0)


    })

    it('remove from cart',()=>{
        const result = cartReducer({products:CART},{type:'REMOVE',payload:{id:'a'}})

        expect(result.products).toHaveLength(3)


    })

    it('change qty',()=>{
        const result = cartReducer({products:CART},{type:'CHANGE_QTY',payload:{id:'d',delta:-1}})
        const item = result.products.find(p => p.id === 'd')
        expect(item?.qty).toBe(3)
    })

    it('change qty when qty=1',()=>{
        const result = cartReducer({products:CART},{type:'CHANGE_QTY',payload:{id:'a',delta:-1}})
        expect(result.products).toHaveLength(3)
        expect(result.products.find(p => p.id === 'a')).toBeUndefined()



    })

});