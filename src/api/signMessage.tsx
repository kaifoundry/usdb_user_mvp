import {
  request,
  RpcErrorCode,
} from "sats-connect";
import { ensureXverseContext } from "../Hooks/useMobileSignIn";
import type { SignMessageParams, SignMessageResult } from "../interfaces/api/signMessageInterface";



export async function signMessage({
  address,
  message,
  protocol,
}: SignMessageParams): Promise<SignMessageResult | null> {
  try {
    try {
      ensureXverseContext();
    } catch (e) {
      console.warn("ensureXverseContext triggered redirect or failed:", e);
      throw e;
    }
    const response = await request("signMessage", {
      address,
      message,
      protocol,
    });

    if (response.status === "success") {
      return {
        signature: response.result.signature,
        messageHash: response.result.messageHash,
        address: response.result.address,
      };
    } else {
      const code = response.error?.code;
      const errData = response.error ?? { message: "Unknown error" };
      if (code === RpcErrorCode.USER_REJECTION) {
        console.warn("User cancelled the signing request");
      } else {
        console.error("Sign message request failed:", errData);
      }
      return null;
    }
  } catch (error) {
    console.error("Unexpected error during signMessage:", error);
    return null;
  }
}
