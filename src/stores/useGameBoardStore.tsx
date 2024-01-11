import create, { State } from 'zustand'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import {solHunterprogramId, solHunterprogramInterface, commitmentLevel,} from "../pages/api/utils/constants"
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import {SolHunter} from "../sol_hunter"

interface GameBoardStore extends State {
    gameBoard: any;
    getGameBoard: (wallet: AnchorWallet, connection: Connection) => void
}

const useGameBoardStore = create<GameBoardStore>((set, _get) => ({
    gameBoard: null,
    getGameBoard: async (wallet, connection) => {
        let gameBoard = null;

        const provider = new AnchorProvider(connection, wallet, {
            preflightCommitment: commitmentLevel,
          });
        
          if (!provider) return;
        
          /* create the program interface combining the idl, program Id, and provider */
          const program = new Program(
            solHunterprogramInterface,
            solHunterprogramId,
            provider
          ) as Program<SolHunter>;

        const [newGameDataAccount] = PublicKey.findProgramAddressSync(
            [Buffer.from("level105", "utf8")],
            solHunterprogramId
          );

        gameBoard = await program.account.gameDataAccount.fetch(newGameDataAccount);

        set((s) => {
            s.gameBoard = gameBoard;
            console.log(`board updated, `, gameBoard);
        })
    }
}));

export default useGameBoardStore;