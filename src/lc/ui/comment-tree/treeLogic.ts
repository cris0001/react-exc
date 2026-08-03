export type Comment={
    id:number,
    name:string,
    text:string,
    replies: Comment[]
}


export function collectIds(comment: Comment): number[] {
    const ids = [comment.id]
    for (const child of comment.replies) {
        ids.push(...collectIds(child))
    }
    return ids
}

export function addReply(tree: Comment[], parentId: number, reply: Comment): Comment[] {
    return tree.map(node => {
        if (node.id === parentId) {
            return { ...node, replies: [...node.replies, reply] }
        }
        return { ...node, replies: addReply(node.replies, parentId, reply) }
    })
}

export function removeComment(tree: Comment[], id: number): Comment[] {
    return tree
        .filter(node => node.id !== id)
        .map(node => ({ ...node, replies: removeComment(node.replies, id) }))
}