import { rpc } from "./connection"


export  async function getBalance(address: string) {
  
  const response = await rpc("getBalance", [address]);

    return response.value/1_000_000_000
}

export  async function getTokens(address: string) {

  const response = await rpc("getTokenAccountsByOwner",
     [address,
     {programId:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
     {encoding:"jsonParsed"},
  ]);

  return  (response.value || [])
    .map((a:any) =>({
      mint: a.account.data.parsed.info.mint,
      amount: a.account.data.parsed.info.tokenAmount.uiAmount,
    }))
    .filter((t:any) => t.amount>0);
};

export   async function getTxns(address:string) {

  const sigs = await rpc("getSignaturesForAddress" ,[address, {limit :10}]);

  return sigs.map((s: any) => ({
    sig: s.signature,
    time: s.blockTime,
    ok: !s.err,
  }));
};

export function short(s: string, n=4 ) {
  return  s.slice(0,n) + "..." + s.slice(-n);
}

export const timeAgo = (ts :number) =>{
  const sec = Math.floor(Date.now()/1000-ts);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
};
