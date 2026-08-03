import {addReply, collectIds, Comment, removeComment} from "@/lc/ui/comment-tree/treeLogic.ts";

export type TreeState={
    tree:Comment[]
    expandedIds: Set<number>
}

export const initialState: TreeState={
    tree:[],
    expandedIds: new Set()
}


export type TreeAction=
    | {type:'ADD_REPLY',payload:{id: number, reply: Comment}}
    | {type:'REMOVE_REPLY',payload:{ id: number}}
    | { type: 'TOGGLE', payload: { comment: Comment, depth: number } }


export function treeReducer(state:TreeState, action:TreeAction):TreeState{

    switch (action.type){
        case "TOGGLE":{
            const {comment,depth} = action.payload
            if(state.expandedIds.has(comment.id)){
                const next = new Set(state.expandedIds)
                for(const id of collectIds(comment)) next.delete(id)
                return {...state,expandedIds: next}
            }

            if (depth === 0) {
                return { ...state, expandedIds: new Set([comment.id]) }
            }
            const next = new Set(state.expandedIds)
            next.add(comment.id)
            return { ...state, expandedIds: next }

        }
        case "ADD_REPLY":{
            const { id, reply } = action.payload
            return { ...state, tree: addReply(state.tree, id, reply) }
        }
        case "REMOVE_REPLY":{
            const { id } = action.payload
            return { ...state, tree: removeComment(state.tree, id) }

        }
        default:{
            const def: never = action;
            return def;
        }

    }

}