import {useState} from "react";
import {calculateWinner} from "@/lc/ui/tic-tac/gameLogic.ts";

export function TicTac(){
    const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null))
    const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X')
console.log(board)
    const winner = calculateWinner(board)
    const isDraw = !winner && board.every(cell => cell !== null)

    const handleClick= (index:number)=>{
        if(winner) return
        if(!board[index] ){
            setBoard(board.map((cell, i) => i === index ? currentPlayer : cell))
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
        }

    }
    const status = winner
        ? `Wygrywa ${winner}`
        : isDraw
            ? 'Remis'
            : `Ruch gracza ${currentPlayer}`

return (
    <>
        <div className={'grid grid-cols-3 gap-2 w-44'}>
            {board.map((el,i)=> <button onClick={()=> handleClick(i)} className={'aspect-square p-2 border border-gray-300 rounded'} key={i}>{el ? el : ''}</button>)}
        </div>
       <div className={'flex flex-col gap-2'}>
           {status}
         <button onClick={() => {
               setBoard(Array(9).fill(null))
               setCurrentPlayer('X')
           }}>reset</button>
       </div>
    </>
)

}