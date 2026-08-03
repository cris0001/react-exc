// Cały stan formularza w JEDNYM reducerze zamiast pięciu useState.
// Czysta funkcja -> testowalna unitami, tak samo jak validate.

import type {FormErrors, FormValues} from "./validate"

export type FormState = {
    values: FormValues
    errors: FormErrors
    submitError: string      // błąd z API (nie dotyczy konkretnego pola)
    isLoading: boolean
    isSuccess: boolean
}

// DISCRIMINATED UNION — pole `type` rozróżnia warianty,
// TS wie, że przy CHANGE_FIELD jest payload, a przy SUBMIT_START go nie ma.
export type FormAction =
    | { type: "CHANGE_FIELD"; payload: { name: keyof FormValues; value: string } }
    | { type: "VALIDATION_FAILED"; payload: FormErrors }
    | { type: "SUBMIT_START" }
    | { type: "SUBMIT_SUCCESS" }
    | { type: "SUBMIT_ERROR"; payload: string }

export const initialState: FormState = {
    values: {email: "", password: ""},
    errors: {},
    submitError: "",
    isLoading: false,
    isSuccess: false,
}

export function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {

        case "CHANGE_FIELD": {
            const {name, value} = action.payload
            return {
                ...state,
                values: {...state.values, [name]: value},
                // pisanie w polu czyści JEGO błąd + błąd z API
                errors: {...state.errors, [name]: undefined},
                submitError: "",
            }
        }

        case "VALIDATION_FAILED":
            return {...state, errors: action.payload}

        case "SUBMIT_START":
            // czyścimy błędy walidacji — skoro wysyłamy, to przeszła
            return {...state, isLoading: true, errors: {}, submitError: ""}

        case "SUBMIT_SUCCESS":
            return {...state, isLoading: false, isSuccess: true}

        case "SUBMIT_ERROR":
            return {...state, isLoading: false, submitError: action.payload}

        default:
            return state
    }
}