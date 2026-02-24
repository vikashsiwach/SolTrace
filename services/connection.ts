const RPC = "https://api.devnet.solana.com";

export const rpc = async (method: string, params: any[]) => {
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
