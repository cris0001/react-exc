import {describe, it, expect} from "vitest"
import {cartReducer, selectTotal, type CartState, type Product} from "./Cartreducer"
// ============================================================
// UNIT TESTY REDUCERA — czysta funkcja (state, action) => newState.
// Najłatwiejsza rzecz do testowania w całym React: zero renderowania,
// zero mocków, zero async. Wejście -> wyjście.
// ============================================================

const keyboard: Product = {id: 1, name: "Klawiatura", price: 250}
const mouse: Product = {id: 2, name: "Mysz", price: 120}

describe("cartReducer", () => {

    // ---------- ADD ----------
    it("adds a new product with quantity 1", () => {
        const state = cartReducer([], {type: "ADD", payload: keyboard})

        expect(state).toEqual([{...keyboard, quantity: 1}])
    })

    it("increases quantity when product is already in the cart", () => {
        const initial: CartState = [{...keyboard, quantity: 1}]

        const state = cartReducer(initial, {type: "ADD", payload: keyboard})

        expect(state).toHaveLength(1)          // NIE duplikuje pozycji
        expect(state[0].quantity).toBe(2)
    })

    it("does not mutate the previous state", () => {
        // KLUCZOWY test dla reducera — musi być czysty
        const initial: CartState = [{...keyboard, quantity: 1}]

        const state = cartReducer(initial, {type: "ADD", payload: keyboard})

        expect(initial[0].quantity).toBe(1)    // stary stan nietknięty
        expect(state).not.toBe(initial)         // nowa referencja tablicy
    })

    // ---------- REMOVE ----------
    it("removes a product from the cart", () => {
        const initial: CartState = [
            {...keyboard, quantity: 2},
            {...mouse, quantity: 1},
        ]

        const state = cartReducer(initial, {type: "REMOVE", payload: {id: 1}})

        expect(state).toEqual([{...mouse, quantity: 1}])
    })

    // ---------- INCREMENT ----------
    it("increments quantity of the selected item", () => {
        const initial: CartState = [{...keyboard, quantity: 1}]

        const state = cartReducer(initial, {type: "INCREMENT", payload: {id: 1}})

        expect(state[0].quantity).toBe(2)
    })

    // ---------- DECREMENT ----------
    it("decrements quantity of the selected item", () => {
        const initial: CartState = [{...keyboard, quantity: 3}]

        const state = cartReducer(initial, {type: "DECREMENT", payload: {id: 1}})

        expect(state[0].quantity).toBe(2)
    })

    it("removes the item when quantity drops to 0", () => {
        // WARTOŚĆ GRANICZNA — tu żyje bug (zostawić 0 czy usunąć?)
        const initial: CartState = [{...keyboard, quantity: 1}]

        const state = cartReducer(initial, {type: "DECREMENT", payload: {id: 1}})

        expect(state).toEqual([])
    })

    it("does not affect other items when decrementing one", () => {
        const initial: CartState = [
            {...keyboard, quantity: 1},
            {...mouse, quantity: 5},
        ]

        const state = cartReducer(initial, {type: "DECREMENT", payload: {id: 1}})

        expect(state).toEqual([{...mouse, quantity: 5}])
    })

    // ---------- CLEAR ----------
    it("clears the whole cart", () => {
        const initial: CartState = [
            {...keyboard, quantity: 2},
            {...mouse, quantity: 1},
        ]

        const state = cartReducer(initial, {type: "CLEAR"})

        expect(state).toEqual([])
    })
})


describe("selectTotal", () => {

    it("returns 0 for an empty cart", () => {
        expect(selectTotal([])).toBe(0)
    })

    it("calculates the total including quantities", () => {
        const items: CartState = [
            {...keyboard, quantity: 2},   // 250 * 2 = 500
            {...mouse, quantity: 3},       // 120 * 3 = 360
        ]

        expect(selectTotal(items)).toBe(860)
    })
})