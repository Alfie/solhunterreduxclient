import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, VersionedTransaction, Connection, PublicKey, clusterApiUrl, TransactionSignature, TransactionMessage, TransactionInstruction } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';
import useIsMounted from "../pages/api/utils/useIsMounted";
import spawnPlayer from "../pages/api/spawnPlayer";

export const SpawnPlayer: FC = () => {
    const { connection } = useConnection();
    const {publicKey } = useWallet();
    const wallet = useAnchorWallet();
    //const mounted = useIsMounted();
    const { getUserSOLBalance } = useUserSOLBalanceStore();
    //const publicKey = wallet.publicKey;

    //const program = anchor.workspace.SolHunter as anchor.Program<SolHunter>;

    const onClick = useCallback(async () => {
        if (!publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }

        let signature: TransactionSignature = '';

        try {
            console.log("wallet" + wallet.publicKey);
            signature = await spawnPlayer(wallet);

            // Get the lates block hash to use on our transaction and confirmation
            let latestBlockhash = await connection.getLatestBlockhash()
            await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

            notify({ type: 'success', message: 'Player Spawned', txid: signature });

            getUserSOLBalance(publicKey, connection);
        } catch (error: any) {
            notify({ type: 'error', message: `spawn failed!`, description: error?.message, txid: signature });
            console.log('error', `spawn failed! ${error?.message}`, signature);
        }
    }, [publicKey, connection, getUserSOLBalance]);

    return (

        <div className="flex flex-row justify-center">
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                    rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            
                        <button
                            className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                            onClick={onClick}
                            >
                                <span>Spawn Player </span>
                
                        </button>
                </div>
        </div>

        
    );
};