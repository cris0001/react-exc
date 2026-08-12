import {useEffect, useReducer} from "react";

export function useReducerPresist<S,A>(
    reducer: (state:S, Action:A)=>S,
    key:string,
    initialState:S
){

    const [state, dispatch] = useReducer(reducer,initialState, (initial)=>{
       try{
           const stored= window.localStorage.getItem(key)
           return stored? JSON.parse(stored): initial
       }catch {
           return initial
       }

    })
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state))
    }, [key, state])

    return [state, dispatch] as const

}