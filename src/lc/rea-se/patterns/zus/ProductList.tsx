import {useCartStore} from "@/lc/rea-se/patterns/zus/store/cartStore";

const products = [
    { id: 1, name: "Kawa", price: 20 },
    { id: 2, name: "Herbata", price: 15 },
    { id: 3, name: "Ciastko", price: 8 },
]

export function ProductList() {

    const addToCart = useCartStore((s) => s.addToCart)

    return (
        <div className={'p-6 flex flex-col gap-3'}>
            <h2 className={'font-bold text-lg'}>Produkty</h2>
            {products.map((el) => (
                <div key={el.id} className={'flex justify-between items-center border border-gray-300 rounded p-4'}>
                    <div className={'flex flex-col'}>
                        <span className={'font-medium'}>{el.name}</span>
                        <span className={'text-gray-500 text-sm'}>{el.price} zł</span>
                    </div>
                    <button onClick={()=> addToCart(el)} className={'px-4 py-2 bg-gray-800 text-white rounded'}>
                        Dodaj
                    </button>
                </div>
            ))}
        </div>
    )
}