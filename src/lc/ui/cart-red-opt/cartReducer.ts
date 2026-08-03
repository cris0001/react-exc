import {Product} from './Cart.tsx'
import {addOrIncrement} from "@/lc/ui/cart-red-opt/cartLogic.ts";

export type CartItem = Product & { qty: number }


export type CartState={
    products: CartItem[],
    error:string,
    loading:boolean
}


export type CartAction=
    | {type:'ADD_OPTYMISTIC', payload:{product:Product}}
    | {type:'ADD_SUCCESS',payload:{newCart:CartItem[]}}
    | {type:'ADD_ERROR', payload:{msg:string, prevCart:CartItem[]}}



export const initialState: CartState={
    products:[],
    error:'',
    loading:false
}


export function cartReducer(state:CartState, action:CartAction):CartState{

    switch (action.type){
        case "ADD_OPTYMISTIC":{
            const {product} = action.payload
            return {...state, products:addOrIncrement(state.products, product),loading:true}
        }
        case "ADD_SUCCESS":{
            const {newCart} = action.payload
            return{...state, loading:false,error:'',products:newCart}
        }
        case "ADD_ERROR":{
            const {msg,prevCart} = action.payload
            return {...state, loading:false,error:msg,products:prevCart}
        }
        default:{
            const d:never=action
            return d
        }

    }
}

export function totalItems(cart:CartItem[]){
    return cart.reduce((acc,prod)=>{
        return acc + prod.qty
    },0)
}

export function totalValue(cart:CartItem[]){
    return cart.reduce((acc,prod)=>{
        return acc + (prod.qty * prod.price)
    },0)
}