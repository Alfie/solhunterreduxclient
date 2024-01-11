import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
//TODO: move this into app for vercel
import { SolHunter } from "../../sol_hunter";
import {
  connection,
  commitmentLevel,
  solHunterprogramId,
  solHunterprogramInterface,
  GAMEAUTHORITYSECRETKEY,
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

    const GAMESIGNER = web3.Keypair.fromSecretKey(GAMEAUTHORITYSECRETKEY);

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