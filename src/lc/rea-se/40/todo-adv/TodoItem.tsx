
import type {TodoType} from './Todo.tsx'
import {memo, useEffect, useState} from "react";

type TodoItemProps = {
    todo: TodoType,
    updateTodo: (title:TodoType['title'], id:TodoType['id'])=> void
    toggleDone: ( id:TodoType['id'])=> void
    removeTodo: ( id:TodoType['id'])=> void
}





function TodoItem({todo,updateTodo,toggleDone,removeTodo}:TodoItemProps){

    console.log(`todo item render - ${todo.title}`)

    const [isEditing, setIsEditing] = useState(false)

    const [editText, setEditText] = useState('')


    const onUpdate= (title:TodoType['title'], id:TodoType['id'])=>{
        updateTodo(title, id)
        setEditText('')
        setIsEditing(false)
    }






    return(
        <>
            <div
                 className={'flex justify-between max-w-[333px] border border-gray-200 rounded px-2 py-1  mt-2 mb-4 '}>
                {isEditing   ? <input  onKeyDown={(e) => {
                        if (e.key === 'Enter') onUpdate(editText, todo.id)
                        if (e.key === 'Escape') setIsEditing(false)
                    }} autoFocus={true} value={editText} onChange={(e) => setEditText(e.target.value)}/> :
                    <span onClick={() => {
                        setIsEditing(true)
                        setEditText(todo.title)
                    }}>{todo.title}</span>}

                {isEditing  ?
                    <div>
                        <button  onClick={() => {
                            onUpdate(editText, todo.id)

                        }}>zapisz</button>
                        <button className={'ml-2'} onClick={() => {

                            setIsEditing(false)
                            setEditText('')

                        }}>anuluj
                        </button>
                    </div> :
                    <div>
                        <button onClick={() => toggleDone(todo.id)}>{todo.done ? 'finished' : 'unfinished'}</button>
                        <button className={'ml-4'}
                                onClick={() =>removeTodo(todo.id) }> usun
                        </button>
                    </div>
                }

            </div>
        </>
    )
}

export const TodoItemMemo = memo(TodoItem)
