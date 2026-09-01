import {useCartStore} from "@/lc/rea-se/patterns/zus/store/cartStore";


export function Cart() {
    const items = useCartStore((s) => s.items)              // lista
    const removeFromCart = useCartStore((s) => s.removeFromCart)
    const changeQty = useCartStore((s) => s.changeQty)
    const total = useCartStore((s) => s.getTotal())         // suma

    return (
        <div className={'p-6 flex flex-col gap-3 border-t border-gray-300'}>
            <h2 className={'font-bold text-lg'}>Koszyk</h2>

            {items.length === 0 && <span className={'text-gray-500'}>Koszyk pusty</span>}

            {items.map((el) => (
                <div key={el.id} className={'flex justify-between items-center border border-gray-200 rounded p-3'}>
                    <div className={'flex flex-col'}>
                        <span className={'font-medium'}>{el.name}</span>
                        <span className={'text-gray-500 text-sm'}>{el.price} zł</span>
                    </div>
                    <div className={'flex items-center gap-3'}>
                        <button onClick={()=> changeQty(el.id, -1)}  className={'w-7 h-7 border border-gray-300 rounded'}>−</button>
                        <span>{el.qty}</span>
                        <button  onClick={()=> changeQty(el.id, 1)} className={'w-7 h-7 border border-gray-300 rounded'}>+</button>
                        <button onClick={()=>removeFromCart(el.id)} className={'text-red-500 text-sm ml-2'}>usuń</button>
                    </div>
                </div>
            ))}

            {items.length > 0 && (
                <div className={'flex justify-between font-bold mt-2'}>
                    <span>Suma:</span>
                    <span>{total} zł</span>
                </div>
            )}
        </div>
    )
}