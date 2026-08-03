import {describe, it, expect} from "vitest"
import {
    addTodo,
    updateTodo,
    deleteTodo,
    deleteCompletedTodos,
    filterTodos,
    countCompleted,
} from "./todoLogic"
import {Todo} from "./TodoList";

// ============================================================
// UNIT TESTY CZYSTYCH FUNKCJI.
// Każda funkcja = osobny describe. W środku: gałęzie + brak mutacji.
// ============================================================

// wspólne dane — 1 ukończone, 2 aktywne
const todos: Todo[] = [
    {id: 1, text: "A", done: true},
    {id: 2, text: "B", done: false},
    {id: 3, text: "C", done: false},
]


describe("addTodo", () => {

    it("adds a todo at the end of the list", () => {
        const result = addTodo(todos, "D")

        expect(result).toHaveLength(4)
        expect(result[3].text).toBe("D")
        expect(result[3].done).toBe(false)   // nowe zadanie zawsze nieukończone
        // id celowo NIE sprawdzamy — Date.now() jest niedeterministyczne
    })

    it("adds a todo to an empty list", () => {
        const result = addTodo([], "Pierwsze")

        expect(result).toHaveLength(1)
        expect(result[0].text).toBe("Pierwsze")
    })

    it("does not mutate the original list", () => {
        const result = addTodo(todos, "D")

        expect(todos).toHaveLength(3)     // oryginał nietknięty
        expect(result).not.toBe(todos)     // nowa referencja
    })
})


describe("updateTodo", () => {

    it("toggles done from false to true", () => {
        const result = updateTodo(todos, 2)

        expect(result[1].done).toBe(true)
    })

    it("toggles done from true to false", () => {
        const result = updateTodo(todos, 1)

        expect(result[0].done).toBe(false)
    })

    it("does not affect other todos", () => {
        const result = updateTodo(todos, 2)

        expect(result[0].done).toBe(true)    // bez zmian
        expect(result[2].done).toBe(false)   // bez zmian
    })

    it("returns the same list content when id does not exist", () => {
        const result = updateTodo(todos, 999)

        expect(result).toEqual(todos)
    })

    it("does not mutate the original list", () => {
        const result = updateTodo(todos, 2)

        expect(todos[1].done).toBe(false)   // oryginalny obiekt nietknięty
        expect(result).not.toBe(todos)
        expect(result[1]).not.toBe(todos[1])  // zmieniony element to NOWY obiekt
    })

    it("keeps untouched todos by reference", () => {
        // nietknięte elementy zachowują referencję -> React.memo mógłby je pominąć
        const result = updateTodo(todos, 2)

        expect(result[0]).toBe(todos[0])
        expect(result[2]).toBe(todos[2])
    })
})


describe("deleteTodo", () => {

    it("removes the todo with the given id", () => {
        const result = deleteTodo(todos, 2)

        expect(result).toHaveLength(2)
        expect(result.map(t => t.id)).toEqual([1, 3])
    })

    it("returns the same content when id does not exist", () => {
        const result = deleteTodo(todos, 999)

        expect(result).toEqual(todos)
    })

    it("does not mutate the original list", () => {
        const result = deleteTodo(todos, 2)

        expect(todos).toHaveLength(3)
        expect(result).not.toBe(todos)
    })
})


describe("deleteCompletedTodos", () => {

    it("removes only completed todos", () => {
        const result = deleteCompletedTodos(todos)

        expect(result).toHaveLength(2)
        expect(result.every(t => !t.done)).toBe(true)
    })

    it("returns an empty list when everything is completed", () => {
        const allDone: Todo[] = [
            {id: 1, text: "A", done: true},
            {id: 2, text: "B", done: true},
        ]

        expect(deleteCompletedTodos(allDone)).toEqual([])
    })

    it("returns an empty list for an empty input", () => {
        expect(deleteCompletedTodos([])).toEqual([])
    })
})


describe("filterTodos", () => {

    it("returns all todos for the 'all' filter", () => {
        expect(filterTodos(todos, "all")).toHaveLength(3)
    })

    it("returns only unfinished todos for the 'active' filter", () => {
        const result = filterTodos(todos, "active")

        expect(result).toHaveLength(2)
        expect(result.every(t => !t.done)).toBe(true)
    })

    it("returns only finished todos for the 'completed' filter", () => {
        const result = filterTodos(todos, "completed")

        expect(result).toHaveLength(1)
        expect(result[0].id).toBe(1)
    })

    it("does not mutate the original list", () => {
        filterTodos(todos, "active")

        expect(todos).toHaveLength(3)
    })
})


describe("countCompleted", () => {

    it("returns 0 for an empty list", () => {
        expect(countCompleted([])).toBe(0)
    })

    it("returns 0 when nothing is completed", () => {
        const noneDone: Todo[] = [{id: 1, text: "A", done: false}]

        expect(countCompleted(noneDone)).toBe(0)
    })

    it("counts completed todos", () => {
        expect(countCompleted(todos)).toBe(1)
    })
})