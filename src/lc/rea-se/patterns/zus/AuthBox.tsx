import { useState } from "react"
import {useAuthStore} from "@/lc/rea-se/patterns/zus/store/authStore";

export function AuthBox() {
    const [name, setName] = useState('')

    const user = useAuthStore((s) => s.user)
    const login = useAuthStore((s) => s.login)
    const logout = useAuthStore((s) => s.logout)
    const handleLogin = () => {
        if (name.trim()) {
            login(name)     // woła akcję ze store
            setName('')
        }    }

    return (
        <div className={'p-4 border border-gray-300 rounded flex items-center gap-3'}>
            {user ? (
                <>
                    <span className={'font-medium'}>Zalogowany: {user}</span>
                    <button onClick={logout} className={'ml-auto px-3 py-1 border border-gray-300 rounded text-sm'}>
                        Wyloguj
                    </button>
                </>
            ) : (
                <>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Twoja nazwa"
                        className={'border border-gray-300 rounded px-3 py-1 flex-1'}
                    />
                    <button
                        onClick={handleLogin}
                        className={'px-4 py-1 bg-gray-800 text-white rounded'}
                    >
                        Zaloguj
                    </button>
                </>
            )}
        </div>
    )
}