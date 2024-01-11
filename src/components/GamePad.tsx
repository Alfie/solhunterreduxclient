import { FC, useCallback, useEffect, useState } from 'react';
import GamePadButton from "./MovePlayerButton";
import movePlayer from "../pages/api/movePlayer";
import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, VersionedTransaction, Connection, PublicKey, clusterApiUrl, TransactionSignature, TransactionMessage, TransactionInstruction } from '@solana/web3.js';


export const GamePad: FC = () => {
    const [square, setSquare] = useState(["","up","","left","","right","","down",""]);
    const wallet = useAnchorWallet();
    //TODO: handleClick and movePlayer
    const onSquareClick = useCallback( async (idx) => {
        let signature: TransactionSignature = '';

        if (idx == 1) {
            console.log("***Pressed up")
            signature = await movePlayer(wallet,1);
        }

        if (idx == 3) {
            console.log("***Pressed left")
            signature = await movePlayer(wallet,2);
        }

        if (idx == 5) {
            console.log("***Pressed right")
            signature = await movePlayer(wallet,0);
        }

        if (idx == 7) {
            console.log("***Pressed down")
            signature = await movePlayer(wallet,3);
        }
      }, []);

    return(
        <>
        <div className="grid grid-cols-3 mx-auto w-52 border-black border-solid border-2">
        {square.map((item, idx) => {
              return (
                <GamePadButton
                  key={idx}
                  value={item}
                  index={idx}
                  handleClick={onSquareClick}
                />
              );
            })}
        </div>
        </>
    )
}