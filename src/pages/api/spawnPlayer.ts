import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { SolHunter } from "../../../../target/types/sol_hunter";
import {
  connection,
  commitmentLevel,
  solHunterprogramId,
  solHunterprogramInterface,
} from "./utils/constants";
import { AnchorWallet, Wallet } from "@solana/wallet-adapter-react";
import { Keypair, TransactionInstruction, TransactionMessage, TransactionSignature, VersionedTransaction } from "@solana/web3.js";
import { SendTransaction } from "components/SendTransaction";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";

export default async function spawnPlayer(
  wallet: AnchorWallet
) {
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

  try {
    const [newGameDataAccount] = await web3.PublicKey.findProgramAddressSync(
      [Buffer.from("level105", "utf8")],
      program.programId
    );

    const [chestVault] = await web3.PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault105", "utf8")],
      program.programId
    );

    //⛔️ MOVE THIS TO local.env !!!!!!!
    const SECRETKEY = new  Uint8Array([113,119,122,142,80,91,80,255,245,137,124,187,118,236,94,57,255,26,47,3,33,79,54,226,175,138,3,246,49,135,246,167,164,92,237,94,255,94,129,33,252,73,187,5,231,20,104,10,150,141,82,159,119,13,124,118,108,5,82,58,74,97,159,153]);
    const GAMESIGNER = web3.Keypair.fromSecretKey(SECRETKEY);

    /* interact with the program via rpc */
    const ixn: TransactionInstruction = await program.methods.spawnPlayer(wallet.publicKey).accounts({
      payer: GAMESIGNER.publicKey,
      chestVault: chestVault, //todo: change this to correct address
      gameDataAccount:  newGameDataAccount, //todo: and this
      systemProgram: web3.SystemProgram.programId,
    }).instruction();

    console.log("pubkey: " + GAMESIGNER);

    const instructions: TransactionInstruction[] = [ixn];
    let blockhash = await connection
        .getLatestBlockhash()
        .then((res) => res.blockhash);
    let txnMsg = new TransactionMessage({payerKey: GAMESIGNER.publicKey, recentBlockhash: blockhash, instructions,}).compileToLegacyMessage();
    let txn = new VersionedTransaction(txnMsg);
    txn.sign([GAMESIGNER]);

    //todo: fetch this properly and this also should be displayed on home screen
    /*const message = await program.account.gameDataAccount.fetch(
      messageAccount.publicKey
    );*/
    console.log("txn: " + txn);
    const signature: TransactionSignature = await connection.sendTransaction(txn) 
    console.log("signature: ", signature);
    return signature;
  } catch (err) {
    console.log("Transaction error: ", err);
    return;
  }
}