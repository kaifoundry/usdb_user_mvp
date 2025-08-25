import { request, AddressPurpose, RpcErrorCode } from "sats-connect";
import { ensureXverseContext } from "../Hooks/useMobileSignIn";
import type { GetAddressesResult, WalletAddress } from "../interfaces/api/getAddressesInterface";

/**
 * Requests the user's wallet addresses.
 * @returns {Promise<GetAddressesResult>}
 */
export const getAddresses = async (): Promise<GetAddressesResult> => {
  try {
    try {
      ensureXverseContext();
    } catch (e) {
      console.warn("ensureXverseContext triggered redirect or failed:", e);
      throw e;
    }
    const response = await request("getAddresses", {
      purposes: [AddressPurpose.Payment],
    });

    if (response.status === "success") {
      const paymentRaw = response.result.addresses.find(
        (address: { address: string; publicKey: string; purpose: AddressPurpose; addressType: string; walletType: "software" | "ledger" | "keystone" }) =>
          address.purpose === AddressPurpose.Payment
      );

      const paymentAddress: WalletAddress | undefined = paymentRaw
        ? {
            address: paymentRaw.address,
            publicKey: paymentRaw.publicKey,
            purpose: paymentRaw.purpose as "payment" | "ordinals" | "stacks",
            addressType: paymentRaw.addressType as "p2tr" | "p2wpkh" | "p2sh" | "stacks",
            walletType: paymentRaw.walletType,
          }
        : undefined;

      return { paymentAddress };
    } else {
      const code = response.error?.code;
      const message = response.error?.message ?? "Unknown wallet error";
      if (code === RpcErrorCode.USER_REJECTION) {
        throw new Error("User rejected address request.");
      } else {
        throw new Error(`Wallet error: ${message}`);
      }
    }
  } catch (err: any) {
    throw new Error(err?.error?.message || err.message || "Unknown error");
  }
};
