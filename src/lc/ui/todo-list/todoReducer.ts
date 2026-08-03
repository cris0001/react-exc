import {Todo} from "./TodoList";
import {addTodo, deleteCompletedTodos, deleteTodo, filterTodos, updateTodo} from "./todoLogic";


export type Filter = "all" | "active" | "completed"

export type TodoState = {
    todos: Todo[]
    filter: Filter
}


export const initialState: TodoState = {
    todos: [],
    filter: 'all'
}

export type TodoAction =
    | { type: "ADD", payload: { text: Todo["text"] } }
    | { type: 'UPDATE', payload: { id: Todo["id"] } }
    | { type: 'DELETE', payload: { id: Todo["id"] } }
    | { type: 'DELETE_COMPLETED' }
    | { type: 'FILTER', payload: { filter: Filter } }


export function todoReducer(state: TodoState, action: TodoAction): TodoState {

    switch (action.type) {

        case "ADD": {
            const {text} = action.payload
            return {...state, todos: addTodo(state.todos, text)}
        }
        case "UPDATE": {
            const {id} = action.payload

            return {...state, todos: updateTodo(state.todos, id)}
        }
        case "DELETE": {
            const {id} = action.payload
            return {...state, todos: deleteTodo(state.todos, id)}
        }
        case "DELETE_COMPLETED": {

            return {...state, todos: deleteCompletedTodos(state.todos)}
        }
        case "FILTER": {
            return {...state, filter: action.payload.filter}
        }
        default:

            return state


    }

}

