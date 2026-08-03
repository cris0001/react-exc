import { describe, it, expect } from "vitest"
import { collectIds, addReply, removeComment, Comment } from "./treeLogic"

const tree: Comment[] = [
    { id: 1, name: "a", text: "a", replies: [
            { id: 2, name: "b", text: "b", replies: [
                    { id: 3, name: "c", text: "c", replies: [] },
                ]},
        ]},
    { id: 4, name: "d", text: "d", replies: [] },
]

const tmpItem:Comment={ id: 5, name: "55", text: "55", replies: [] }


describe('collectIds', ()=>{

    it('return element reply ids',()=>{
        const result = collectIds(tree[0])

        expect(result).toEqual(expect.arrayContaining([1, 2, 3]))
    })

    it('return single id for leaf', ()=>{
        const result = collectIds(tree[1])

        expect(result).toEqual([4])
    })

})

describe('addReply', () => {

    it('add reply to picked node', () => {
        const result = addReply(tree, 2, tmpItem)
        expect(collectIds(result[0])).toEqual([1, 2, 3, 5])
    })


    it('does not mutate tree', () => {
        addReply(tree, 2, tmpItem)
        expect(collectIds(tree[0])).toEqual([1, 2, 3])
    })

});


describe('removeComment', () => {

    it('removes selected comment node',()=>{
        const result = removeComment(tree, 2)
        expect(collectIds(result[0])).toEqual([1])
    })

    it('does not mutate tree',()=>{
        removeComment(tree, 2)
        expect(collectIds(tree[0])).toEqual([1, 2, 3,])
    })
});