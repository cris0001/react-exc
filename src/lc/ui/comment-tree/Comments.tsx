import { Comment} from "@/lc/ui/comment-tree-red/treeLogic";
import {Dispatch, useReducer, useState} from "react";
import {TreeAction, treeReducer, TreeState} from "@/lc/ui/comment-tree-red/treeReducer";


const levelStyles = [
    "border-l-green-400",
    "border-l-red-400",
    "border-l-blue-400",
    "border-l-yellow-400",
]

type SingleCommentProps = {
    comment: Comment,
    depth: number,
    expandedIds: Set<number>,
    dispatch: Dispatch<TreeAction>
}

function SingleComment({comment, depth = 0, expandedIds,dispatch}: SingleCommentProps) {
    const [newReply, setNewReply] = useState<Comment | null>(null)

    const isExpanded = expandedIds.has(comment.id)
    const hasReplies = comment.replies.length > 0

    const onAdd = () => {
        if (!newReply) return
        dispatch({type:'ADD_REPLY',payload:{id:comment.id, reply:newReply}})
        setNewReply(null)
    }

    return (
        <div className={`border-l-2 ${levelStyles[depth % levelStyles.length]} pl-3 py-2 mt-2`}>
            <div className="flex items-center gap-2 text-sm">
                {hasReplies ? (
                    <button
                        type="button"
                        onClick={() => dispatch({ type: 'TOGGLE', payload: { comment,depth } })}
                        className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                        aria-label={isExpanded ? "Zwiń" : "Rozwiń"}
                    >
                        {isExpanded ? "−" : "+"}
                    </button>
                ) : (
                    <span className="w-5 h-5 inline-block" />
                )}

                <span className="font-medium text-gray-800">{comment.name || "—"}</span>
                <span className="text-gray-600">{comment.text}</span>
                {hasReplies && (
                    <span className="text-xs text-gray-400">({comment.replies.length})</span>
                )}

                <div className="ml-auto flex gap-1">
                    <button
                        type="button"
                        onClick={() => setNewReply({id: Math.random(), text: '', name: '', replies: []})}
                        className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                        Odpowiedz
                    </button>
                    <button
                        type="button"
                        onClick={() => dispatch({type:'REMOVE_REPLY',payload:{id:comment.id}})}
                        className="text-xs px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50"
                    >
                        Usuń
                    </button>
                </div>
            </div>

            {newReply && (
                <div className="flex gap-2 mt-2 ml-7">
                    <input
                        autoFocus
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Twoja odpowiedź…"
                        value={newReply.text}
                        onChange={(e) => setNewReply({...newReply, text: e.target.value, name: e.target.value})}
                    />
                    <button
                        type="button"
                        onClick={onAdd}
                        className="text-sm px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700"
                    >
                        Dodaj
                    </button>
                    <button
                        type="button"
                        onClick={() => setNewReply(null)}
                        className="text-sm px-2 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-100"
                    >
                        Anuluj
                    </button>
                </div>
            )}

            {isExpanded && comment.replies.map(el => (
                <SingleComment
                    key={el.id}
                    comment={el}
                    depth={depth + 1}
                    expandedIds={expandedIds}
                    dispatch={dispatch}
                />
            ))}
        </div>
    )
}

export function Comments({initialTree}: { initialTree: Comment[] }) {

    const initialState:TreeState={
        tree:initialTree,
        expandedIds: new Set()
    }

 const[state, dispatch]= useReducer(treeReducer,initialState)
    const {tree,expandedIds} = state

    if (!tree) return <>no data</>

    return (
        <div className="max-w-2xl mx-auto ">
            {tree.map((el) => (
                <SingleComment
                    key={el.id}
                    comment={el}
                    depth={0}
                    expandedIds={expandedIds}
                    dispatch={dispatch}                />
            ))}
        </div>
    )
}