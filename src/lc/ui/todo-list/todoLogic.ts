import {Todo} from "./TodoList";
import {Filter, TodoState} from "./todoReducer";
import {Property} from "csstype";

export function addTodo(todos: Todo[], text: Todo["text"]): Todo[] {
    return [...todos, {id: Date.now(), text, done: false}]
}


export function updateTodo(todos: Todo[], id: Todo["id"]): Todo[] {
    return todos.map(todo =>
        todo.id === id ? {...todo, done: !todo.done} : todo
    )
}

export function deleteTodo(todos: Todo[], id: Todo["id"]): Todo[] {
    return todos.filter(todo => todo.id !== id)
}

export function deleteCompletedTodos(todos: Todo[]): Todo[] {
    return todos.filter(todo => !todo.done)
}


export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
    switch (filter) {
        case "active":
            return todos.filter(todo => !todo.done)
        case "completed":
            return todos.filter(todo => todo.done)
        default:
            return todos
    }
}

export function countCompleted(todos: Todo[]): number {
    return todos.filter(todo => todo.done).length
}