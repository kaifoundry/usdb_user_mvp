import {
  request,
  RpcErrorCode,
} from "sats-connect";
import { ensureXverseContext } from "../Hooks/useMobileSignIn";
import type { SignPsbtParams, SignPsbtResult } from "../interfaces/api/signPsbtInterface";



export async function signPsbt({
  psbtBase64,
  signInputs,
  broadcast = false,
}: SignPsbtParams): Promise<SignPsbtResult | null> {
  try {
    try {
      ensureXverseContext();
    } catch (e) {
      console.warn("ensureXverseContext triggered redirect or failed:", e);
      throw e;
    }
    const response = await request('signPsbt', {
      psbt: psbtBase64,
      signInputs: signInputs,
      broadcast: broadcast,
    });

    if (response.status === "success") {
      console.log("Signed PSBT:", response.result.psbt);
      if (response.result.txid) {
        console.log("Transaction ID:", response.result.txid);
      }
      return {
        psbt: response.result.psbt,
        txid: response.result.txid,
      };
    } else {
      const code = response.error?.code;
      const message = response.error?.message ?? response.error ?? "Unknown error";
      if (code === RpcErrorCode.USER_REJECTION) {
        console.warn("User rejected signing request.");
      } else {
        console.error("Signing failed:", message);
      }
      return null;
    }
  } catch (err) {
    console.error("Request error:", err);
    return null;
  }
}

