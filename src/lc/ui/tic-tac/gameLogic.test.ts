
import {describe} from "vitest";
import {calculateWinner, Cell} from "@/lc/ui/tic-tac/gameLogic.ts";




const boardXwin:Cell[] = ['X', 'X', 'X', 'O', 'O', null, null, null, null]

const boardOwin:Cell[] = ['O', 'X', 'X', 'O', 'X', null, 'O', null, null]

const boardDraw:Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']

describe('calculateWinner', () => {

    it('x win test',()=>{
    const result = calculateWinner(boardXwin)
        expect(result).toEqual('X')

    })
    it('o win test',()=>{
        const result = calculateWinner(boardOwin)
        expect(result).toEqual('O')

    })

    it('no winnder defined',()=>{
        const result = calculateWinner(boardDraw)
        expect(result).toEqual(null)
    })

    it('draw',()=>{
        expect(calculateWinner(boardDraw)).toBe(null)
        expect(boardDraw.every(cell => cell !== null)).toBe(true)
    })

});