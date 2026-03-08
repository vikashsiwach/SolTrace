import { useState, useCallback, useMemo } from "react";
import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import { useWalletStore } from "../stores/wallet-store";

const APP_IDENTITY = {
  name: "SolTrace",
  uri: "https://soltrace.com",
  icon: "favicon.ico",
};

// decode base64 address to PublicKey (phantom returns base64 encoded addresses)
const decodeAddress = (address: string): PublicKey => {
  if (address.includes("=") || address.includes("+") || address.includes("/")) {
    const bytes = Uint8Array.from(atob(address), (c) => c.charCodeAt(0));
    return new PublicKey(bytes);
  }
  return new PublicKey(address);
};

export function useWallet() {
  const [connecting, setConnecting] = useState(false);
  const [sending, setSending] = useState(false);
  const isDevnet = useWalletStore((s) => s.isDevnet);
  const connectedPublicKey = useWalletStore((s) => s.connectedPublicKey);
  const setConnectedPublicKey = useWalletStore((s) => s.setConnectedPublicKey);

  const publicKey = useMemo(() => {
    if (!connectedPublicKey) return null;
    try {
      return new PublicKey(connectedPublicKey);
    } catch {
      return null;
    }
  }, [connectedPublicKey]);

  const cluster = isDevnet ? "devnet" : "mainnet-beta";
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");

  // CONNECT — Ask Phantom to authorize our app
  const connect = useCallback(async () => {
    setConnecting(true);

    try {
      const walletAddress = await transact(async (wallet: Web3MobileWallet) => {

        const authResult = await wallet.authorize({
          cluster: cluster,
          identity: APP_IDENTITY,
        });

        if (!authResult.accounts || authResult.accounts.length === 0) {
          throw new Error("No accounts returned from wallet authorization");
        }

        const userAddress = authResult.accounts[0].address;

        const pubkey = decodeAddress(userAddress);

        return pubkey.toBase58();
      });

      setConnectedPublicKey(walletAddress);
      return new PublicKey(walletAddress);
    } catch (error: unknown) {
      console.error("[useWallet] connect failed:", error);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, [cluster, setConnectedPublicKey]);

  // DISCONNECT
  const disconnect = useCallback(() => {
    setConnectedPublicKey(null);
  }, [setConnectedPublicKey]);

  // GET BALANCE
  const getBalance = useCallback(async () => {
    if (!publicKey) return 0;
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  }, [publicKey, connection]);

  // SEND SOL — Build, sign, and send a transaction
  const sendSOL = useCallback(
    async (toAddress: string, amountSOL: number) => {

      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      setSending(true);

      try {
        // step 1: get blockhash
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();

        // step 2: build transaction
        const toPublicKey = new PublicKey(toAddress);
        const lamports = Math.round(amountSOL * LAMPORTS_PER_SOL);

        const transaction = new Transaction();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: toPublicKey,
            lamports,
          })
        );

        // step 3: sign transaction inside transact (shows wallet popup
        const signedTransaction = await transact(
          async (wallet: Web3MobileWallet) => {

            await wallet.authorize({
              cluster: cluster,
              identity: APP_IDENTITY,
            });

            const signedTxs = await wallet.signTransactions({
              transactions: [transaction],
            });

            if (!signedTxs || signedTxs.length === 0) {
              throw new Error("No signed transaction returned from wallet");
            }

            return signedTxs[0];
          }
        );

        // step 4: delay after phantom closes (network reconnect)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // step 5: send transaction with retry logic
        const rawTransaction = signedTransaction.serialize();

        let signature: string | null = null;
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            signature = await connection.sendRawTransaction(rawTransaction, {
              skipPreflight: true,
              maxRetries: 2,
            });
            break;
          } catch (err: unknown) {
            lastError = err as Error;
            if (attempt < 3) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }

        if (!signature) {
          throw lastError || new Error("Failed to send transaction after 3 attempts");
        }

        // step 6: confirm transaction
        const confirmation = await connection.confirmTransaction(
          {
            signature,
            blockhash,
            lastValidBlockHeight,
          },
          "confirmed"
        );

        if (confirmation.value.err) {
          throw new Error(
            `Transaction failed: ${JSON.stringify(confirmation.value.err)}`
          );
        }

        return signature;
      } catch (error) {
        console.error("[useWallet] sendSOL error:", error);
        throw error;
      } finally {
        setSending(false);
      }
    },
    [publicKey, connection, cluster]
  );

  return {
    publicKey,
    connected: !!publicKey,
    connecting,
    sending,
    connect,
    disconnect,
    getBalance,
    sendSOL,
    connection,
  };
}