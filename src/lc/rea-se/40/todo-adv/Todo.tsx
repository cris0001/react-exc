import {useCallback, useEffect, useReducer, useState} from "react";
import {initialState, todoReducer, TodoState} from "@/lc/rea-se/40/todo-adv/todoTeducer.ts";
import { TodoItemMemo} from "@/lc/rea-se/40/todo-adv/TodoItem.tsx";


export type TodoType = {
    id:string,
    title: string,
    done: boolean

}

export function init(initial: TodoState): TodoState {
    try {
        const stored = window.localStorage.getItem('todoss')
        if (stored) {
            return { ...initial, todos: JSON.parse(stored) }
        }
        return initial
    } catch {
        return initial
    }
}

export function Todo(){

    const[state,dispach] = useReducer(todoReducer,initialState,init)

    useEffect(() => {
        localStorage.setItem('todoss', JSON.stringify(state.todos))
    }, [state.todos])

    const [newTodo, setNewTodo] = useState('')



const {todos,filter} = state


    const addTodo = (title:TodoType['title'])=>{
        if (!title.trim()) return
        dispach({type:'ADD_TODO',payload:{title}})
        setNewTodo('')
    }

    const updateTodo = useCallback((title:TodoType['title'], id:TodoType['id'])=>{
        dispach({type:'UPDATE_TODO',payload:{title, id}})

    },[])

    const toggleDone = useCallback((id:TodoType['id'])=>{
        dispach({
            type: 'TOGGLE_DONE',
            payload: {id}
        })
    },[])

    const removeTodo = useCallback((id:TodoType['id'])=>{
        dispach({type: 'REMOVE_TODO', payload: {id}})
    },[])

    const finishedTodos = todos.filter((todo)=> todo.done).length


const filtered = todos.filter((todo)=>{
    if(filter==='done') return todo.done
    if(filter==='active') return !todo.done
    return true
})

    return(
        <>

            <div>
                <input onKeyDown={(e) => {
                    if (e.key === 'Enter') addTodo(newTodo)
                }} className={'border border-gray-300 rounded'} value={newTodo}
                       onChange={(e) => setNewTodo(e.target.value)}/>

                <button className={'border border-blue-300 rounded'} onClick={() => addTodo(newTodo)}>dodaj</button>
            </div>
            <div className="flex gap-2">
                <button onClick={() => dispach({type:'SET_FILTER',payload:{filter:'all'}})}>wszystkie</button>
                <button onClick={() => dispach({type:'SET_FILTER',payload:{filter:'active'}})}>aktywne</button>
                <button onClick={() => dispach({type:'SET_FILTER',payload:{filter:'done'}})}>ukończone</button>
            </div>


            {filtered.map((todo) =>
           <TodoItemMemo removeTodo={removeTodo} toggleDone={toggleDone} todo={todo} updateTodo={updateTodo} key={todo.id}/>
            )
            }
            {filtered.length === 0 && todos.length > 0 && <p>brak zadań w tym filtrze</p>}
            {todos.length > 0 && <div className={'flex flex-col gap-2'}>
                <span className={'text-center'}> finished:{finishedTodos} / {todos.length}</span>
                {finishedTodos > 0 && <button onClick={()=> dispach({type:'REMOVE_DONE'})}>clear finished</button>}
            </div>}

        </>
    )
}