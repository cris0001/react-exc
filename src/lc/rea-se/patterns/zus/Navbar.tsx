    import {useCartStore} from "@/lc/rea-se/patterns/zus/store/cartStore";


    export function Navbar() {
        const total = useCartStore((s) => s.getTotal())

        return (
            <div className={'flex justify-between items-center px-6 py-4 border-b border-gray-300'}>
                <span className={'font-bold text-lg'}>Sklep</span>
                <div className={'flex items-center gap-2'}>
                    <span>🛒</span>
                    <span className={'font-medium'}>{total}</span>
                </div>
            </div>
        )
    }