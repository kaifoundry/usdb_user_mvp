import {
  request,
  RpcErrorCode,
} from "sats-connect";

interface SignPsbtParams {
  psbtBase64: string;
  signInputs: Record<string, number[]>;
  broadcast?: boolean;
}

interface SignPsbtResult {
  psbt: string;  
  txid?: string; 
}

export async function signPsbt({
  psbtBase64,
  signInputs,
  broadcast = false,
}: SignPsbtParams): Promise<SignPsbtResult | null> {
  try {
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
      if (response.error.code === RpcErrorCode.USER_REJECTION) {
        console.warn("User rejected signing request.");
      } else {
        console.error("Signing failed:", response.error.message);
      }
      return null;
    }
  } catch (err) {
    console.error("Request error:", err);
    return null;
  }
}

