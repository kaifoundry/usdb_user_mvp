import { RpcErrorCode, request } from "sats-connect";
import type { RawRuneBalance, RuneBalance } from "../interfaces/api/getRunesBalanceInterface";



export async function getRunesBalance(): Promise<RuneBalance[]> {
  let response = await request("runes_getBalance", null);
  console.log('response',response)
  if (response.status === "success") {
    return formatRawBalances(response.result.balances as RawRuneBalance[]);
  }
  if (response.error.code !== RpcErrorCode.ACCESS_DENIED) {
    throw new Error("Failed to get balance.", { cause: response.error });
  }
  const permissionRes = await request("wallet_requestPermissions", undefined);
  if (permissionRes.status === "error") {
    throw new Error("User declined connection.");
  }
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
