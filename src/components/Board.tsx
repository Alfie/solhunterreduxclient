import { FC, useEffect, useState } from 'react';
import {  useAnchorWallet } from '@solana/wallet-adapter-react';
import useGameBoardStore from '.././stores/useGameBoardStore';
import Square from "./cell";

import {
    connection,
  } from "pages/api/utils/constants";

export const Board: FC = () => {

    const wallet = useAnchorWallet();

    //TODO: deal w/ loading and polling data
    const gameBoard = useGameBoardStore((s) => s.gameBoard)
    const {getGameBoard} = useGameBoardStore()

    let squares = Array(16).fill(null);
    let idx = 15;
    if(gameBoard){
        for (var x of [0,1,2,3]){
            for (var y of [0,1,2,3]){
                if (gameBoard.board[x][y].state == 1)
                    squares[idx] = "🤠";

                if (gameBoard.board[x][y].state == 2)
                    squares[idx] = "💰";
                
                idx--;
            }
        }
    };
    //squares[14] = "😈"; 
    const [square, setSquare] = useState(squares);
    
    console.log("squares: "+ squares.map((item, idx) => {return (item)}));
    
    useEffect(() =>{
        if (wallet) {
            getGameBoard(wallet, connection)
            setSquare(squares);
        }

    },[wallet,connection, getGameBoard]);
      
    return (
        <>
        <div className="grid grid-cols-4 mx-auto w-96 border-black border-solid border-2">
        {squares.map((item, idx) => {
              return (
                <Square
                  key={idx}
                  value={item}
                  index={idx}
                  //handleClick={onSquareClick}
                />
              );
            })}
        </div>
        </>
    )
}