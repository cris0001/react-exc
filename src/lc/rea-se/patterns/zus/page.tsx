import { Navbar } from './Navbar'
import { ProductList } from './ProductList'
import { Cart } from './Cart'
import { AuthBox } from './AuthBox'
import {useAuthStore} from "@/lc/rea-se/patterns/zus/store/authStore";

export default function Page() {
    const user = useAuthStore((s) => s.user)

    return (
        <div className={'max-w-lg mx-auto'}>
            <AuthBox />

            {user ? (
                <>
                    <Navbar />
                    <ProductList />
                    <Cart />
                </>
            ) : (
                <div className={'text-center text-gray-500 mt-8'}>
                    Zaloguj się, żeby zobaczyć sklep
                </div>
            )}
        </div>
    )
}