'use client'

import {useReducer, useRef} from "react"
import {validate, type FormValues} from "./validate"
import {login} from "./api"
import {formReducer, initialState} from "./formReducer"

export function LoginForm() {
    // JEDEN reducer zamiast pięciu useState.
    // Zysk: powiązane zmiany dzieją się w jednej akcji, logika przejść
    // stanu jest w czystej funkcji (testowalnej), komponent tylko dispatchuje.
    const [state, dispatch] = useReducer(formReducer, initialState)
    const {values, errors, submitError, isLoading, isSuccess} = state

    // REF zostaje — to blokada SYNCHRONICZNA przed double-submit.
    // dispatch, tak jak setState, jest odroczony (re-render), więc guard
    // oparty na state.isLoading przepuściłby drugi submit.
    const isSubmitting = useRef(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        dispatch({
            type: "CHANGE_FIELD",
            payload: {name: name as keyof FormValues, value},
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (isSubmitting.current) return

        const validationErrors = validate(values)

        if (Object.keys(validationErrors).length > 0) {
            dispatch({type: "VALIDATION_FAILED", payload: validationErrors})
            return
        }

        isSubmitting.current = true
        dispatch({type: "SUBMIT_START"})

        try {
            await login(values.email, values.password)
            dispatch({type: "SUBMIT_SUCCESS"})
        } catch (err) {
            dispatch({
                type: "SUBMIT_ERROR",
                payload: err instanceof Error ? err.message : "Coś poszło nie tak",
            })
        } finally {
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