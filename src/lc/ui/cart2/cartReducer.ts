import {Product} from './Cart.tsx'

export type CartItem = Product & { qty: number }


export type CartState={
    products: CartItem[]
}


export type CartAction=
    | {type:'ADD', payload:{product:Product}}
    | {type:"REMOVE",payload:{id:Product["id"]}}
    | {type:"CLEAR"}
    | {type: 'CHANGE_QTY',payload:{delta: 1 | -1,id:Product["id"]}}


export const initialState: CartState={
    products:[]
}


export function cartReducer(state:CartState, action:CartAction):CartState{

    switch (action.type){
        case "ADD":{
            const {product} = action.payload
            const exists = state.products.find((el)=> el.id === product.id)
            if(exists){
                return {
                    ...state,
                    products: state.products.map(item =>
                        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                    )
                }
            }else{
                return {...state,
                    products: [...state.products, {...product, qty:1}]}
            }

        }
        case "REMOVE":{
            const {id} = action.payload
            return{...state, products: state.products.filter((el)=> el.id !==id) }
        }
        case "CHANGE_QTY":{
            const {id,delta} = action.payload
          return {...state, products: state.products.map((el)=> el.id===id ? {...el, qty:el.qty+delta}:el).filter((el)=> el.qty >0 )}

        }
        case "CLEAR":{
            return {...state, products:[]}
        }

        default:{
            const def: never = action
            return def
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