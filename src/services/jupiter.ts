// jupiter metis swap api service for token swaps
const JUPITER_API = "https://api.jup.ag/swap/v1";
const JUPITER_API_KEY = process.env.EXPO_PUBLIC_JUPITER_API_KEY || "";

// major tokens mints on solana mainnet
export const TOKENS = {
  SOL: "So11111111111111111111111111111111111111112", // wrapped SOL
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
};

//token data for display
export const TOKEN_INFO: Record<
  string,
  { symbol: string; name: string; decimals: number; color: string }
  > = {
  [TOKENS.SOL]: { symbol: "SOL", name: "Solana", decimals: 9, color:"#9945FF" },
  [TOKENS.USDC]: { symbol: "USDC", name: "USD Coin", decimals: 6, color: "#2775CA" },
  [TOKENS.USDT]: { symbol: "USDT", name: "Tether", decimals: 6, color: "#26A17B" },
  [TOKENS.BONK]: { symbol: "BONK", name: "Bonk", decimals: 5, color:"#F7931A" },
  [TOKENS.JUP]: { symbol: "JUP", name: "Jupiter", decimals: 6, color:  "#14F195" },
  [TOKENS.WIF]: { symbol: "WIF", name: "dogwifhat", decimals: 6, color:  "#E91E63" },
};

//available tokens for the picker
export const AVAILABLE_TOKENS = [
  TOKENS.SOL,
  TOKENS.USDC,
  TOKENS.USDT,
  TOKENS.BONK,
  TOKENS.JUP,
  TOKENS.WIF,
];

export interface QuoteResponse {
  inputMint : string;
  inAmount : string;
  outputMint : string;
  outAmount : string;
  otherAmountThreshold : string;
  swapMode : string;
  slippageBps : number;
  priceImpactPct : string;
  routerPlan : Array<{
    swapInfo : {
      ammKey : string;
      label : string;
      inputMint : string;
      outputMint : string;
      inAmount : string;
      outAmount : string;
      feeAmount?: string;
      feeMint? : string; 
    };
    percent : number;
  }>;
}

// --------------------------------------
// GET QUOTE - how much user will receive
// --------------------------------------
export async function getSwapQuote(
  inputMint : string,
  outputMint : string,
  amount: number,
  slippageBps : number = 50
): Promise<QuoteResponse> {

  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount : amount.toString(),
    slippageBps : slippageBps.toString(),
  });

  const url = `${JUPITER_API}/quote?${params}`;

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-api-key": JUPITER_API_KEY,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Jupiter quote failed: ${response.status}`);
      }

      const quote = await response.json();
      return quote;
    } catch (err) {
      lastError = err as Error;
      if (attempt < 3) {
        ("[jupiter] retrying in 1 second...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError || new Error("Failed to get quote after 3 attempts");
}
// ------------------------------------
// GET SWAP TRANSACTION - ready to sign
// ------------------------------------
export async function getSwapTransaction(
  quoteResponse: QuoteResponse,
  userPublicKey: string
): Promise<string> {
  const swapUrl = `${JUPITER_API}/swap`;
  // build request body with explanations
  const requestBody = {
    // the quote we got from /quote endpoint
    quoteResponse,
    // user's wallet address that will sign the transaction
    userPublicKey,
    // auto wrap SOL to wSOL and unwrap wSOL to SOL (for SOL swaps)
    wrapAndUnwrapSol: true,
    // dynamically calculate compute units needed (saves fees)
    dynamicComputeUnitLimit: true,
    // priority fee settings to land transaction faster
    prioritizationFeeLamports: {
      priorityLevelWithMaxLamports: {
        // priority level: medium, high, or veryHigh
        priorityLevel: "high",
        // max lamports willing to pay for priority (cap to prevent overpaying)
        maxLamports: 1000000, // 0.001 SOL max priority fee
      },
    },
  };

  const response = await fetch(swapUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": JUPITER_API_KEY,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Jupiter swap failed: ${response.status}`);
  }

  const data = await response.json();
  return data.swapTransaction;
}

// -----------------------------------
// GET TOKEN PRICE - current USD price
// -----------------------------------
export async function getTokenPrice(mintAddress: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.jup.ag/price/v2?ids=${mintAddress}`,
      {
        headers: {
          "x-api-key": JUPITER_API_KEY,
        },
      }
    );
    const data = await response.json();
    return data.data?.[mintAddress]?.price || 0;
  } catch {
    return 0;
  }
}

// ------------------------
// UNIT CONVERSION HELPERS
// ------------------------
export function toSmallestUnit(amount: number, decimals: number): number {
  return Math.round(amount * Math.pow(10, decimals));
}

export function fromSmallestUnit(
  amount: number | string,
  decimals: number
): number {
  return Number(amount) / Math.pow(10, decimals);
}