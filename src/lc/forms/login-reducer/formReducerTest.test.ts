import {describe, it, expect} from "vitest"
import {formReducer, initialState, type FormState} from "./formReducer"

// ============================================================
// UNIT TESTY REDUCERA FORMULARZA.
// To jest ZYSK z useReducer: przejścia stanu, które wcześniej były
// rozsmarowane po handlerach, teraz są czystą funkcją -> testujesz je
// bez renderowania komponentu.
// ============================================================

describe("formReducer", () => {

    // ---------- CHANGE_FIELD ----------
    it("updates the value of the given field", () => {
        const state = formReducer(initialState, {
            type: "CHANGE_FIELD",
            payload: {name: "email", value: "a@b.pl"},
        })

        expect(state.values.email).toBe("a@b.pl")
        expect(state.values.password).toBe("")   // drugie pole nietknięte
    })

    it("clears the error of the field being edited", () => {
        const withError: FormState = {
            ...initialState,
            errors: {email: "Email jest wymagany", password: "Hasło jest wymagane"},
        }

        const state = formReducer(withError, {
            type: "CHANGE_FIELD",
            payload: {name: "email", value: "a"},
        })

        expect(state.errors.email).toBeUndefined()
        expect(state.errors.password).toBe("Hasło jest wymagane")   // cudzy błąd zostaje
    })

    it("clears the API error on any field change", () => {
        const withApiError: FormState = {...initialState, submitError: "Nieprawidłowe dane"}

        const state = formReducer(withApiError, {
            type: "CHANGE_FIELD",
            payload: {name: "email", value: "a"},
        })

        expect(state.submitError).toBe("")
    })

    it("does not mutate the previous state", () => {
        const state = formReducer(initialState, {
            type: "CHANGE_FIELD",
            payload: {name: "email", value: "a@b.pl"},
        })

        expect(initialState.values.email).toBe("")   // stary stan nietknięty
        expect(state).not.toBe(initialState)
        expect(state.values).not.toBe(initialState.values)
    })

    // ---------- VALIDATION_FAILED ----------
    it("stores validation errors", () => {
        const errors = {email: "Email jest wymagany"}

        const state = formReducer(initialState, {type: "VALIDATION_FAILED", payload: errors})

        expect(state.errors).toEqual(errors)
        expect(state.isLoading).toBe(false)   // walidacja nie odpala ładowania
    })

    // ---------- SUBMIT_START ----------
    it("turns on loading and clears previous errors", () => {
        const dirty: FormState = {
            ...initialState,
            errors: {email: "stary błąd"},
            submitError: "stary błąd API",
        }

        const state = formReducer(dirty, {type: "SUBMIT_START"})

        expect(state.isLoading).toBe(true)
        expect(state.errors).toEqual({})
        expect(state.submitError).toBe("")
    })

    // ---------- SUBMIT_SUCCESS ----------
    it("turns off loading and marks success", () => {
        const loading: FormState = {...initialState, isLoading: true}

        const state = formReducer(loading, {type: "SUBMIT_SUCCESS"})

        expect(state.isLoading).toBe(false)
        expect(state.isSuccess).toBe(true)
    })

    // ---------- SUBMIT_ERROR ----------
    it("turns off loading and stores the API error", () => {
        const loading: FormState = {...initialState, isLoading: true}

        const state = formReducer(loading, {
            type: "SUBMIT_ERROR",
            payload: "Nieprawidłowy email lub hasło",
        })

        expect(state.isLoading).toBe(false)
        expect(state.submitError).toBe("Nieprawidłowy email lub hasło")
        expect(state.isSuccess).toBe(false)
    })

    it("keeps entered values after a failed submit", () => {
        // user nie powinien tracić tego, co wpisał
        const filled: FormState = {
            ...initialState,
            values: {email: "a@b.pl", password: "haslo123"},
            isLoading: true,
        }

        const state = formReducer(filled, {type: "SUBMIT_ERROR", payload: "Błąd"})

        expect(state.values).toEqual({email: "a@b.pl", password: "haslo123"})
    })
})
