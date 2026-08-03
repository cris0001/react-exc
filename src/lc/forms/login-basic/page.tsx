// Next.js App Router — punkt wejścia dla trasy /rrr/1
// Server Component (brak 'use client') — tylko renderuje LoginForm,
// który sam ma 'use client', bo używa hooków.

import {LoginForm} from "./LoginForm"

export default function Page() {
    return (
        <main className="p-8">
            <h1 className="text-xl mb-4">Logowanie</h1>
            <LoginForm/>
        </main>
    )
}