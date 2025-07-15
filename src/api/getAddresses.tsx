import { request, AddressPurpose, RpcErrorCode } from "sats-connect";

export interface paymentItem {
  purpose: any; 
  address: string;
}

export interface getAddressesResult {
  paymentAddress?: paymentItem;
}

/**
 * @returns {Promise<getAddressesResult>}
 */

export const getAddresses = async (): Promise<getAddressesResult> => {
  try {
    const response = await request("getAddresses", { purposes: [AddressPurpose.Payment] });

    if (response.status === "success") {
      const paymentAddressItem = response.result.addresses.find(
        (address: any) => address.purpose === AddressPurpose.Payment
      );
console.log({name: "getAddresses", paymentAddressItem});
      return {
        paymentAddress: paymentAddressItem,
      };
    } else {
      if (response.error.code === RpcErrorCode.USER_REJECTION) {
        throw new Error("User rejected wallet connection.");
      } else {
        throw new Error(`Wallet error: ${response.error.message}`);
      }
    }
  } catch (err: any) {
    throw new Error(err?.error?.message || err.message || "Unknown error");
  }
};
