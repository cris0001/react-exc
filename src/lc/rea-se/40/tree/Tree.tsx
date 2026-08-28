import { useState } from "react";

type Comment = {
    id: number
    text: string
    replies: Comment[]
}

const initialComments: Comment[] = [
    {
        id: 1,
        text: 'Pierwszy komentarz',
        replies: [
            {
                id: 2,
                text: 'Odpowiedź do pierwszego',
                replies: [
                    { id: 3, text: 'Odpowiedź do odpowiedzi', replies: [] },
                ],
            },
            { id: 4, text: 'Druga odpowiedź do pierwszego', replies: [] },
            { id: 7, text: 'Trzecia odpowiedź', replies: [] },
            { id: 8, text: 'Czwarta odpowiedź', replies: [] },
            { id: 9, text: 'Piąta odpowiedź', replies: [] },
        ],
    },
    {
        id: 5,
        text: 'Drugi komentarz',
        replies: [
            { id: 6, text: 'Pierwsza odpowiedź do drugiego', replies: [] },
        ],
    },
]

const levelStyles = [
    "border-l-green-400",
    "border-l-red-400",
    "border-l-blue-400",
    "border-l-yellow-400",
    "border-l-purple-400",
]

const VISIBLE_LIMIT = 3

type TreeItemProps = {
    comment: Comment
    depth: number
    expandedIds: Set<number>
    toggle: (comment: Comment, depth: number) => void
    handleRemove: (id: number) => void
    handleAdd: (id: number, text: string) => void
    handleEdit: (id: number, newText: string) => void
}

const countComments = (comment: Comment): number =>
    comment.replies.reduce((acc, item) => acc + 1 + countComments(item), 0)

const collectIds = (comment: Comment): number[] => [
    comment.id,
    ...comment.replies.flatMap((child) => collectIds(child))
]

function TreeItem({ comment, depth, expandedIds, toggle, handleRemove, handleAdd, handleEdit }: TreeItemProps) {
    const [text, setText] = useState('')
    const [newText, setNewText] = useState('')
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [showAll, setShowAll] = useState(false)

    const expanded = expandedIds.has(comment.id)
    const hasReplies = comment.replies.length > 0

    // widoczne dzieci: limit albo wszystkie
    const visible = showAll ? comment.replies : comment.replies.slice(0, VISIBLE_LIMIT)
    const hiddenCount = comment.replies.length - visible.length

    const onAdd = () => {
        if (text.trim()) {
            handleAdd(comment.id, text)
            setText('')
            setOpen(false)
        }
    }

    return (
        <div className={`border-l-2 ${levelStyles[depth % levelStyles.length]} pl-3 py-2 mt-2`}>
            <div className="flex items-center gap-2 text-sm">
                {hasReplies ? (
                    <button
                        type="button"
                        onClick={() => toggle(comment, depth)}
                        className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                        aria-label={!expanded ? "Rozwiń" : "Zwiń"}
                    >
                        {!expanded ? "+" : "−"}
                    </button>
                ) : (
                    <span className="w-5 h-5 inline-block" />
                )}

                {!openEdit && (
                    <span
                        onClick={() => { setNewText(comment.text); setOpenEdit(true) }}
                        role="button"
                        className="text-gray-800 cursor-pointer"
                    >
                        {comment.text}
                    </span>
                )}
                {openEdit && (
                    <div>
                        <input
                            onBlur={() => setOpenEdit(false)}
                            autoFocus
                            className="border border-gray-200 rounded"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                        />
                        <button onClick={() => { setNewText(''); setOpenEdit(false) }} className="ml-2">anuluj</button>
                        <button
                            onMouseDown={() => { if (newText.trim()) { handleEdit(comment.id, newText); setOpenEdit(false) } }}
                            className="ml-2"
                        >
                            zapisz
                        </button>
                    </div>
                )}
                {hasReplies && (
                    <span className="text-xs text-gray-400">
                        ({comment.replies.length}) ({countComments(comment)} komentarzy)
                    </span>
                )}

                <div className="ml-auto flex gap-1">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                        Odpowiedz
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRemove(comment.id)}
                        className="text-xs px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50"
                    >
                        Usuń
                    </button>
                </div>
            </div>

            {open && (
                <div className="flex gap-2 mt-2 ml-7">
                    <input
                        autoFocus
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Twoja odpowiedź…"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button type="button" onClick={onAdd} className="text-sm px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700">
                        Dodaj
                    </button>
                    <button
                        type="button"
                        onClick={() => { setOpen(false); setText('') }}
                        className="text-sm px-2 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-100"
                    >
                        Anuluj
                    </button>
                </div>
            )}

            {expanded && hasReplies && (
                <div>
                    {visible.map((rep) => (
                        <TreeItem
                            toggle={toggle}
                            expandedIds={expandedIds}
                            key={rep.id}
                            comment={rep}
                            depth={depth + 1}
                            handleAdd={handleAdd}
                            handleRemove={handleRemove}
                            handleEdit={handleEdit}
                        />
                    ))}

                    {hiddenCount > 0 && (
                        <button
                            onClick={() => setShowAll(true)}
                            className="text-xs text-blue-600 hover:underline mt-1 ml-7"
                        >
                            Pokaż {hiddenCount} więcej
                        </button>
                    )}
                    {showAll && comment.replies.length > VISIBLE_LIMIT && (
                        <button
                            onClick={() => setShowAll(false)}
                            className="text-xs text-blue-600 hover:underline mt-1 ml-7"
                        >
                            Pokaż mniej
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export function Tree() {
    const [tree, setTree] = useState(initialComments)
    const [expandedIds, setExpandedIds] = useState(new Set<number>())

    const toggle = (comment: Comment, depth: number) => {
        setExpandedIds((prev) => {
            let next: Set<number>
            if (depth === 0) {
                next = prev.has(comment.id) ? new Set<number>() : new Set<number>([comment.id])
            } else {
                next = new Set(prev)
                if (next.has(comment.id)) {
                    for (const id of collectIds(comment)) next.delete(id)
                } else {
                    next.add(comment.id)
                }
            }
            return next
        })
    }

    const editComment = (id: number, tree: Comment[], newText: string): Comment[] =>
        tree.map((el) =>
            el.id === id
                ? { ...el, text: newText }
                : { ...el, replies: editComment(id, el.replies, newText) }
        )

    const removeComment = (id: number, tree: Comment[]): Comment[] =>
        tree.filter((el) => el.id !== id).map((el) => ({ ...el, replies: removeComment(id, el.replies) }))

    const addComment = (id: number, text: string, tree: Comment[]): Comment[] =>
        tree.map((el) =>
            el.id === id
                ? { ...el, replies: [...el.replies, { id: Date.now(), text, replies: [] }] }
                : { ...el, replies: addComment(id, text, el.replies) }
        )

    const handleRemove = (id: number) => setTree((p) => removeComment(id, p))
    const handleAdd = (id: number, text: string) => setTree((p) => addComment(id, text, p))
    const handleEdit = (id: number, newText: string) => setTree((p) => editComment(id, p, newText))

    return (
        <div className="max-w-2xl mx-auto p-4">
            {tree.map((item) => (
                <TreeItem
                    toggle={toggle}
                    expandedIds={expandedIds}
                    key={item.id}
                    comment={item}
                    depth={0}
                    handleAdd={handleAdd}
                    handleRemove={handleRemove}
                    handleEdit={handleEdit}
                />
            ))}
            <button onClick={() => setExpandedIds(new Set())}>zwiń wszystko</button>
            <button
                onClick={() => setExpandedIds(new Set(tree.flatMap((el) => collectIds(el))))}
                className="ml-2"
            >
                rozwiń wszystko
            </button>
        </div>
    )
}