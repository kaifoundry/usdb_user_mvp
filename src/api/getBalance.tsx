import { request, RpcErrorCode } from "sats-connect";
import type { GetBalanceResult } from "../interfaces/api/getBalanceInterface";


/**
 * Get the connected wallet's BTC balance.
 * @returns {Promise<GetBalanceResult>}
 */
export const getBalance = async (): Promise<GetBalanceResult> => {
  try {
    const response = await request("getBalance", null);

    if (response.status === "success") {
      console.log("Wallet balance:", response.result);

      return {
        paymentAddress: {
          confirmed: response.result.confirmed,
          unconfirmed: response.result.unconfirmed,
          total: response.result.total,
        },
      };
    } else {
      if (response.error.code === RpcErrorCode.USER_REJECTION) {
        throw new Error("User rejected the request.");
      } else {
        throw new Error(`Wallet error: ${response.error.message}`);
      }
    }
  } catch (err: any) {
    console.error("getBalance error:", err);
    throw new Error(err?.error?.message || err.message || "Unknown error");
  }
};
