import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
//TODO: move this into app for vercel
import { SolHunter } from "../../sol_hunter";
import { AnchorWallet, Wallet } from "@solana/wallet-adapter-react";
import {
    connection,
    commitmentLevel,
    solHunterprogramId,
    solHunterprogramInterface,
    GAMEAUTHORITYSECRETKEY,
  } from "./utils/constants";


  import { Keypair, TransactionInstruction, TransactionMessage, TransactionSignature, VersionedTransaction } from "@solana/web3.js";

export default async function movePlayer(wallet: AnchorWallet, direction: number){
    const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: commitmentLevel,
    });
    
    if (!provider) return;

    const program = new Program(
        solHunterprogramInterface,
        solHunterprogramId,
        provider
    ) as Program<SolHunter>;

    try {
        const [newGameDataAccount] = await web3.PublicKey.findProgramAddressSync(
            [Buffer.from("level105", "utf8")],
            program.programId
        );

        const [chestVault] = await web3.PublicKey.findProgramAddressSync(
            [Buffer.from("chestVault105", "utf8")],
            program.programId
        );
        
        const GAMESIGNER = web3.Keypair.fromSecretKey(GAMEAUTHORITYSECRETKEY);

        /* interact with the program via rpc */
        //TODO: pass wallet down here
        const ixn: TransactionInstruction = await program.methods.movePlayer(direction).accounts({
            player: wallet.publicKey,
            chestVault: chestVault, //todo: change this to correct address
            gameDataAccount:  newGameDataAccount, //todo: and this
            //systemProgram: web3.SystemProgram.programId,
        }).instruction();

        //sign and send tx
        const instructions: TransactionInstruction[] = [ixn];
        let blockhash = await connection
            .getLatestBlockhash()
            .then((res) => res.blockhash);
        let txnMsg = new TransactionMessage({payerKey: GAMESIGNER.publicKey, recentBlockhash: blockhash, instructions,}).compileToLegacyMessage();
        let txn = new VersionedTransaction(txnMsg);
        txn.sign([GAMESIGNER]);

        const signature: TransactionSignature = await connection.sendTransaction(txn) 
        console.log("signature: ", signature);
        return signature;
    
    } catch (err) {
        console.log("Transaction error: ", err);
        return;
    }
}