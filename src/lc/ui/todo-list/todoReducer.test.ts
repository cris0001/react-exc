import {describe, it, expect} from "vitest"
import {todoReducer, initialState} from "./todoReducer"
import type {TodoState} from "./todoReducer"
import {Todo} from "./TodoList";

// ============================================================
// TESTY REDUCERA.
// Reguły operacji są już pokryte w todoLogic.test.ts, więc tutaj
// sprawdzamy WARSTWĘ REDUCERA: czy akcja trafia we właściwą funkcję,
// czy reszta stanu (np. filter) przeżywa, czy nie ma mutacji.
// ============================================================

const todos: Todo[] = [
    {id: 1, text: "A", done: true},
    {id: 2, text: "B", done: false},
]

const state: TodoState = {todos, filter: "all"}


describe("todoReducer", () => {

    it("returns the initial state for an unknown action", () => {
        // @ts-expect-error — celowo nieistniejąca akcja, sprawdzamy default
        expect(todoReducer(state, {type: "NOPE"})).toBe(state)
    })

    // ---------- ADD ----------
    it("adds a todo", () => {
        const result = todoReducer(state, {type: "ADD", payload: {text: "C"}})

        expect(result.todos).toHaveLength(3)
        expect(result.todos[2].text).toBe("C")
    })

    it("keeps the current filter when adding", () => {
        const withFilter: TodoState = {todos, filter: "active"}

        const result = todoReducer(withFilter, {type: "ADD", payload: {text: "C"}})

        expect(result.filter).toBe("active")   // spread ...state zadziałał
    })

    // ---------- UPDATE ----------
    it("toggles the given todo", () => {
        const result = todoReducer(state, {type: "UPDATE", payload: {id: 2}})

        expect(result.todos[1].done).toBe(true)
    })

    // ---------- DELETE ----------
    it("deletes the given todo", () => {
        const result = todoReducer(state, {type: "DELETE", payload: {id: 1}})

        expect(result.todos).toHaveLength(1)
        expect(result.todos[0].id).toBe(2)
    })

    // ---------- DELETE_COMPLETED ----------
    it("deletes all completed todos", () => {
        const result = todoReducer(state, {type: "DELETE_COMPLETED"})

        expect(result.todos).toHaveLength(1)
        expect(result.todos[0].done).toBe(false)
    })

    // ---------- FILTER ----------
    it("stores the selected filter", () => {
        const result = todoReducer(state, {type: "FILTER", payload: {filter: "completed"}})

        expect(result.filter).toBe("completed")
    })

    it("does NOT trim the todo list when filtering", () => {
        // KLUCZOWY test — filtr to kryterium wyświetlania, nie usuwanie danych.
        // Gdyby reducer zapisywał przefiltrowaną listę, zadania znikałyby na zawsze.
        const result = todoReducer(state, {type: "FILTER", payload: {filter: "completed"}})

        expect(result.todos).toHaveLength(2)
        expect(result.todos).toBe(state.todos)   // ta sama tablica, nietknięta
    })

    // ---------- CZYSTOŚĆ ----------
    it("does not mutate the previous state", () => {
        const result = todoReducer(state, {type: "ADD", payload: {text: "C"}})

        expect(state.todos).toHaveLength(2)   // stary stan nietknięty
        expect(result).not.toBe(state)         // nowy obiekt stanu
    })

    it("starts with an empty list and the 'all' filter", () => {
        expect(initialState).toEqual({todos: [], filter: "all"})
    })
})