import { useWalletStore } from "../src/stores/wallet-store";


export const rpc = async (method: string, params: any[]) => {

  const isDevnet = useWalletStore.getState().isDevnet;

  const RPC =isDevnet
  ? "https://api.devnet.solana.com"
  : "https://api.mainnet-beta.solana.com";

    const res = await fetch(RPC,{
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    return data.result;
}
