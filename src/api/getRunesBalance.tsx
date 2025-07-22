import { RpcErrorCode, request } from "sats-connect";

export interface RuneBalance {
  runeName: string;
  amount: number;
  spendableBalance: number;
  symbol?: string;
  divisibility?: number;
  inscriptionId?: string;
id?:string;
mintable?: boolean;
}

interface RawRuneBalance {
  runeName: string;
  amount: string;
  spendableBalance: string;
  symbol?: string;
  divisibility?: number;
  inscriptionId?: string | null;
  id:string;
mintable?: boolean;
}

export async function getRunesBalance(): Promise<RuneBalance[]> {
  // 1️⃣ First attempt to get balance
  let response = await request("runes_getBalance", null);
  console.log("getRunesBalance response:", response);

  if (response.status === "success") {
    return formatRawBalances(response.result.balances as RawRuneBalance[]);
  }

  // 2️⃣ If failed, check if it’s ACCESS_DENIED
  if (response.error.code !== RpcErrorCode.ACCESS_DENIED) {
    throw new Error("Failed to get balance.", { cause: response.error });
  }

  // 3️⃣ Request permissions
  const permissionRes = await request("wallet_requestPermissions", undefined);
  if (permissionRes.status === "error") {
    throw new Error("User declined connection.");
  }

  // 4️⃣ Retry balance
  response = await request("runes_getBalance", null);
  console.log("Retry getRunesBalance response:", response);

  if (response.status === "success") {
    return formatRawBalances(response.result.balances as RawRuneBalance[]);
  }

  throw new Error("Failed to get balance after requesting permissions.", {
    cause: response.error,
  });
}

function formatRawBalances(raw: RawRuneBalance[]): RuneBalance[] {
  return raw.map((b) => ({
    runeName: b.runeName,
    amount: parseFloat(b.amount),
    spendableBalance: parseFloat(b.spendableBalance),
    symbol: b.symbol,
    divisibility: b.divisibility,
    inscriptionId: b.inscriptionId ?? undefined,
    id: b.id,
    mintable: b.mintable ?? false,
  }));
}
