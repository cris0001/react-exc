'use client'

import {useRef, useState} from "react"
import {validate, type FormValues, type FormErrors} from "./validate"
import {login} from "./api"

export function LoginForm() {
    const [values, setValues] = useState<FormValues>({email: "", password: ""})
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitError, setSubmitError] = useState("")   // błąd z API (nie z pola)
    const [isLoading, setIsLoading] = useState(false)     // UI: disabled + tekst
    const [isSuccess, setIsSuccess] = useState(false)

    // REF jako synchroniczna blokada przed double-submit.
    // setState jest ODROCZONY (re-render), więc guard na isLoading
    // przepuściłby drugi submit w oknie przed re-renderem.
    // ref.current mutuje się NATYCHMIAST -> guard działa od razu.
    const isSubmitting = useRef(false)

    // jeden handler dla wszystkich pól — czyta name z inputa
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setValues((prev) => ({...prev, [name]: value}))

        // czyścimy błąd tego pola, gdy user zaczyna poprawiać
        setErrors((prev) => ({...prev, [name]: undefined}))
        setSubmitError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()   // bez tego przeglądarka przeładuje stronę

        // guard: ref (natychmiastowy), NIE isLoading (odroczony)
        if (isSubmitting.current) return

        const validationErrors = validate(values)
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) return

        isSubmitting.current = true   // blokada logiczna (natychmiast)
        setIsLoading(true)             // blokada wizualna (po re-renderze)
        setSubmitError("")

        try {
            await login(values.email, values.password)
            setIsSuccess(true)
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Coś poszło nie tak")
        } finally {
            setIsLoading(false)
            isSubmitting.current = false
        }
    }

    if (isSuccess) return <p>Zalogowano.</p>

    return (
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
            <div className="flex flex-col gap-1">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"

                    value={values.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    className="border border-gray-300 p-2 rounded"
                />
                {errors.email && (
                    <span role="alert" className="text-sm text-red-600">{errors.email}</span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="password">Hasło</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    aria-invalid={!!errors.password}
                    className="border border-gray-300 p-2 rounded"
                />
                {errors.password && (
                    <span role="alert" className="text-sm text-red-600">{errors.password}</span>
                )}
            </div>

            {/* błąd z API — osobno od błędów pól */}
            {submitError && (
                <span role="alert" className="text-sm text-red-600">{submitError}</span>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white p-2 rounded disabled:bg-gray-400"
            >
                {isLoading ? "Logowanie..." : "Zaloguj"}
            </button>
        </form>
    )
}