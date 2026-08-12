import {useState} from "react";


type TodoType = {
    id:string,
    title: string,
    done: boolean

}


export function Todo(){


    const [todos, setTodos] = useState<TodoType[]>([])
    const [newTodo, setNewTodo] = useState('')

    const [editId, setEditId] = useState<string | null>(null)
    const [editText, setEditText] = useState('')

    const [filter, setFilter] = useState<'all'|'active'| 'done'>('all')

    const addNewTodo=(newTodo:string)=>{
        if(newTodo.trim()==='') return
        const id = crypto.randomUUID()
        const newToboObj:TodoType = {id,title:newTodo, done:false}
        setTodos((prev)=> [newToboObj, ...prev])
        setNewTodo('')
    }

    const toggle = (id:string)=>{
        setTodos((prev)=> prev.map((todo)=> todo.id === id? {...todo,done: !todo.done}: todo))
    }

    const updateTodo = (id:string)=>{
        setTodos((prev)=> prev.map((todo)=> todo.id === id? {...todo,title: editText}: todo))
        setEditText('')
        setEditId(null)
    }

    const removeTodo = (id:string)=>{
        setTodos((prev)=> prev.filter((el)=> el.id !==id))
    }

    const clearFinished = ()=>{
        setTodos((prev)=> prev.filter(todo => !todo.done))
    }

    const calculateFinished = todos.filter((todo)=> todo.done).length

    const filtered = todos.filter((todo) => {
        if (filter === 'active') return !todo.done
        if (filter === 'done') return todo.done
        return true
    })

    return(
        <>

            <div>
                <input onKeyDown={(e) => {
                    if (e.key === 'Enter') addNewTodo(newTodo)
                }} className={'border border-gray-300 rounded'} value={newTodo}
                       onChange={(e) => setNewTodo(e.target.value)}/>

                <button className={'border border-blue-300 rounded'} onClick={() => addNewTodo(newTodo)}>dodaj</button>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setFilter('all')}>wszystkie</button>
                <button onClick={() => setFilter('active')}>aktywne</button>
                <button onClick={() => setFilter('done')}>ukończone</button>
            </div>


            {filtered.map((todo) => <div key={todo.id}
                                      className={'flex justify-between max-w-[333px] border border-gray-200 rounded px-2 py-1  mt-2 mb-4 '}>
                {editId === todo.id ? <input onKeyDown={(e) => {
                        if (e.key === 'Enter') updateTodo(todo.id)
                        if (e.key === 'Escape') setEditId(null)
                    }} autoFocus={true} value={editText} onChange={(e) => setEditText(e.target.value)}/> :
                    <span onClick={() => {
                        setEditId(todo.id)
                        setEditText(todo.title)
                    }}>{todo.title}</span>}

                {editId === todo.id ?
                    <div>
                        <button onClick={() => updateTodo(todo.id)}>zapisz</button>
                        <button className={'ml-2'} onClick={() => {
                            setEditId(null)

                        }}>anuluj
                        </button>
                    </div> :
                    <div>
                        <button onClick={() => toggle(todo.id)}>{todo.done ? 'finished' : 'unfinished'}</button>
                        <button className={'ml-4'} onClick={() => removeTodo(todo.id)}> usun</button>
                    </div>
                }

            </div>)
            }
            {filtered.length === 0 && todos.length > 0 && <p>brak zadań w tym filtrze</p>}
            {todos.length > 0 && <div className={'flex flex-col gap-2'}>
                <span className={'text-center'}> finished:{calculateFinished} / {todos.length}</span>
                {calculateFinished > 0 && <button onClick={clearFinished}>clear finished</button>}
            </div>}

        </>
    )
}