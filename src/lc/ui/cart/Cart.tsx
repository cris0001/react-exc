'use client'

import {useReducer} from "react"
import {cartReducer, initialState, selectTotal, type Product} from "./Cartreducer"

const products: Product[] = [
    {id: 1, name: "Klawiatura", price: 250},
    {id: 2, name: "Mysz", price: 120},
    {id: 3, name: "Monitor", price: 899},
]

export function Cart() {
    const [items, dispatch] = useReducer(cartReducer, initialState)

    // suma jako POCHODNA — liczona w renderze, nie trzymana w stanie
    const total = selectTotal(items)

    return (
        <div className="flex flex-col gap-6">

            {/* LISTA PRODUKTÓW */}
            <section>
                <h2 className="mb-2 font-bold">Produkty</h2>
                <ul className="flex flex-col gap-2">
                    {products.map((product) => (
                        <li key={product.id} className="flex items-center gap-3">
                            <span className="w-32">{product.name}</span>
                            <span className="w-20">{product.price} zł</span>
                            <button
                                onClick={() => dispatch({type: "ADD", payload: product})}
                                className="border px-2 py-1 rounded"
                            >
                                Dodaj
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {/* KOSZYK */}
            <section>
                <h2 className="mb-2 font-bold">Koszyk</h2>

                {items.length === 0 ? (
                    <p>Koszyk jest pusty</p>
                ) : (
                    <>
                        <ul className="flex flex-col gap-2">
                            {items.map((item) => (
                                <li key={item.id} className="flex items-center gap-3">
                                    <span className="w-32">{item.name}</span>
                                    <span className="w-20">{item.price} zł</span>

                                    <button
                                        onClick={() => dispatch({type: "DECREMENT", payload: {id: item.id}})}
                                        aria-label={`Zmniejsz ilość: ${item.name}`}
                                        className="border px-2 rounded"
                                    >
                                        -
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        onClick={() => dispatch({type: "INCREMENT", payload: {id: item.id}})}
                                        aria-label={`Zwiększ ilość: ${item.name}`}
                                        className="border px-2 rounded"
                                    >
                                        +
                                    </button>

                                    <button
                                        onClick={() => dispatch({type: "REMOVE", payload: {id: item.id}})}
                                        aria-label={`Usuń: ${item.name}`}
                                        className="border px-2 rounded"
                                    >
                                        Usuń
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <p className="mt-4 font-bold">Suma: {total} zł</p>

                        <button
                            onClick={() => dispatch({type: "CLEAR"})}
                            className="mt-2 border px-3 py-1 rounded"
                        >
                            Wyczyść koszyk
                        </button>
                    </>
                )}
            </section>
        </div>
    )
}