import {useReducer, useState} from "react";
import {Filter, initialState, todoReducer} from "./todoReducer";
import {countCompleted, filterTodos} from "./todoLogic";

export type Todo = {
    id: number
    text: string
    done: boolean
}

export function TodoList() {

    const [state, dispatch] = useReducer(todoReducer, initialState)
    const [newTodo, setNewTodo] = useState('')
    const {todos, filter} = state

    const handleAdd = () => {
        const text = newTodo.trim()
        if (!text) return
        dispatch({type: 'ADD', payload: {text}})
        setNewTodo('')
    }

    const handleFilter = (filter: Filter) => {
        dispatch({type: 'FILTER', payload: {filter}})

    }

    const filtered = filterTodos(todos, filter)

    return (
        <>


            <div className={'flex pb-2 border-b border-gray-200'}>
                <input className={'border border-gray-300'} value={newTodo}
                       onChange={(e) => setNewTodo(e.target.value)}/>
                <button onClick={handleAdd}>dodaj</button>
            </div>

            <ul>
                {filtered.map((todo) => <li key={todo.id}>
                    <div className={'flex justify-between'}>
                        <span>{todo.text}</span>
                        <input aria-label={`Oznacz: ${todo.text}`}
                               onChange={() => dispatch({type: 'UPDATE', payload: {id: todo.id}})} type="checkbox"
                               checked={todo.done}/>
                        <button aria-label={`Usuń: ${todo.text}`}
                                onClick={() => dispatch({type: 'DELETE', payload: {id: todo.id}})}>delete
                        </button>

                    </div>
                </li>)}
            </ul>

            {`ukończono: ${countCompleted(todos)} z ${todos.length}`}
            <button className={'border border-red-300 px-2'} onClick={() => dispatch({type: 'DELETE_COMPLETED'})}>usun
                ukonczone
            </button>
            <div className={'flex gap-4 mt-5'}>
                <button onClick={() => handleFilter('all')}
                        className={'border border-blue-200 px-2 rounded'}>wszystkie
                </button>
                <button onClick={() => handleFilter('completed')}
                        className={'border border-blue-200 px-2 rounded'}>zakonczone
                </button>
                <button onClick={() => handleFilter('active')}
                        className={'border border-blue-200 px-2 rounded'}>niezakonczone
                </button>
            </div>


        </>
    )
}