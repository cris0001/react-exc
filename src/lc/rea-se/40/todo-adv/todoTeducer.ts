
type TodoType = {
    id:string,
    title: string,
    done: boolean

}

export type Filters= 'all'|'done'|'active'



export type TodoState={
    todos: TodoType[]
    filter: Filters
}





export type TodoActions=
    | {type:'ADD_TODO', payload:{title: TodoType['title']}}
    | {type:'UPDATE_TODO', payload:{title: TodoType['title'], id:TodoType['id']}}
    | {type:'TOGGLE_DONE', payload:{id:TodoType['id']} }
    | {type:'REMOVE_TODO', payload:{id:TodoType['id']} }
    | {type:'REMOVE_DONE' }
    | {type:'SET_FILTER',payload:{filter:Filters} }



export const initialState:TodoState={
    todos:[],
    filter:'all'
}




export function todoReducer(state:TodoState,  action: TodoActions):TodoState{

switch (action.type){
    case "ADD_TODO":{
        const {title} = action.payload
        const id = crypto.randomUUID()
        return {...state, todos:[{id,title,done:false}, ...state.todos]}
    }

    case "UPDATE_TODO":{
        const {title,id} = action.payload
        return {...state, todos:state.todos.map((todo)=> todo.id ===id ? {...todo, title}: todo )}
    }

    case "TOGGLE_DONE":{
        const {id} = action.payload
        return {...state, todos: state.todos.map((todo)=> todo.id ===id ? {...todo, done: !todo.done}: todo)}
    }
    case "REMOVE_DONE":{
    return {...state, todos: state.todos.filter((todo)=> !todo.done)}
    }
    case "REMOVE_TODO": {
        const { id } = action.payload
        return { ...state, todos: state.todos.filter(todo => todo.id !== id) }
    }
    case "SET_FILTER":{
        const {filter} = action.payload
        return {...state, filter}
    }

    default: {
        const _exhaustive: never = action
        return state
    }

}

}