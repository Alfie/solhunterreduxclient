import idl from "../../../../../target/idl/sol_hunter.json"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

/* Constants for RPC Connection the Solana Blockchain */
export const commitmentLevel = "processed";
export const endpoint =
  process.env.HELIUS_API_URL || clusterApiUrl("devnet");
export const connection = new Connection(endpoint, commitmentLevel);

const SECRETKEYENV = process.env.NEXT_PUBLIC_SECRETKEY
const SECRETKEYSTRARRAY = SECRETKEYENV.split(',');
const SECRETKEYNUMARRAY = SECRETKEYSTRARRAY.map(function(str){return parseInt(str);})
export const GAMEAUTHORITYSECRETKEY = new Uint8Array(SECRETKEYNUMARRAY);

/* Constants for the Deployed "Hello World" Program */
export const solHunterprogramId = new PublicKey(idl.metadata.address);
export const solHunterprogramInterface = JSON.parse(JSON.stringify(idl));