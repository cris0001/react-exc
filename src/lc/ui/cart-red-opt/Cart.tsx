import {useReducer} from "react";
import {initialState, cartReducer, totalItems, totalValue} from "@/lc/ui/cart-red-opt/cartReducer.ts";
import {addToCart} from "@/lc/ui/cart-red-opt/api.ts";

export type Product = { id: string; name: string; price: number }

const CATALOG: Product[] = [
    { id: "a", name: "Kawa", price: 18 },
    { id: "b", name: "Herbata", price: 12 },
    { id: "c", name: "Ciastko", price: 8 },
    { id: "d", name: "Kanapka", price: 22 },
]

export function Cart() {

    const [state,dispatch] = useReducer(cartReducer, initialState)

const handleAddToCart = async(prod:Product)=>{
    const previous = state.products

    dispatch({type:'ADD_OPTYMISTIC',payload:{product:prod}})

try{
        const data = await addToCart(prod,previous)
        dispatch({type:'ADD_SUCCESS',payload:{newCart:data}})

}catch(err){
    dispatch({type:'ADD_ERROR',payload:{msg:err instanceof Error? err.message:'wystapil blad',prevCart:previous}})

}

}

    return (
        <div className="flex gap-8 p-6 max-w-3xl mx-auto">
            {/* KATALOG */}
            <div className="flex-1">
                <h2 className="font-semibold mb-3">Produkty</h2>
                <ul className="flex flex-col gap-2">
                    {CATALOG.map((p) => (
                        <li
                            key={p.id}
                            className="flex items-center justify-between border border-gray-200 rounded px-3 py-2"
                        >
                            <span>
                                {p.name} — {p.price} zł
                            </span>
                            <button onClick={()=> handleAddToCart(p)} className="text-sm px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700">
                                Dodaj
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* KOSZYK */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold">Koszyk</h2>
                    {/*<button onClick={()=> dispatch({type:"CLEAR"})} className="text-xs text-red-500 hover:underline">*/}
                    {/*    Wyczyść*/}
                    {/*</button>*/}
                </div>

                <ul className="flex flex-col gap-2">
                    {state.products.map((prod) => <li key={prod.id}
                        className="flex items-center justify-between border border-gray-200 rounded px-3 py-2">
                        <span className="text-sm">
                            {prod.name} <span className="text-gray-400">{prod.price}</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <button className="w-6 h-6 rounded border border-gray-300 hover:bg-gray-100">
                                −
                            </button>
                            <span className="w-6 text-center text-sm">{prod.qty}</span>
                            <button  className="w-6 h-6 rounded border border-gray-300 hover:bg-gray-100">
                                +
                            </button>
                            <button  className="ml-2 text-xs text-red-500 hover:underline">
                                usuń
                            </button>
                        </div>
                    </li>)}
                </ul>

                {state.error && <span className={'border border-red-300 '}>{state.error}</span>}
                {/* PODSUMOWANIE */}
                <div className="mt-4 pt-3 border-t border-gray-200 text-sm flex flex-col gap-1">
                    <div className="flex justify-between">
                        <span>Sztuk:</span>
                        <span>{totalItems(state.products)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Razem:</span>
                        <span>{totalValue(state.products)} zł</span>
                    </div>
                </div>
            </div>
        </div>
    )
}