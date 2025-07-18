import {
  request,
  RpcErrorCode,
  MessageSigningProtocols,
} from "sats-connect";

export interface SignMessageParams {
  address: string;
  message: string;
  protocol?: MessageSigningProtocols;
}

export interface SignMessageResult {
  signature: string;
  messageHash: string;
  address: string;
}

export async function signMessage({
  address,
  message,
  protocol,
}: SignMessageParams): Promise<SignMessageResult | null> {
  try {
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
      if (response.error.code === RpcErrorCode.USER_REJECTION) {
        console.warn("User cancelled the signing request");
      } else {
        console.error("Sign message request failed:", response.error);
      }
      return null;
    }
  } catch (error) {
    console.error("Unexpected error during signMessage:", error);
    return null;
  }
}
