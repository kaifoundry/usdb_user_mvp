export interface WalletAddress {
  address: string;
  publicKey: string;
  purpose: "payment" | "ordinals" | "stacks";
  addressType: "p2tr" | "p2wpkh" | "p2sh" | "stacks";
  walletType: "software" | "ledger" | "keystone";
}

export interface GetAddressesResult {
  paymentAddress?: WalletAddress;
  ordinalsAddress?: WalletAddress;
  stacksAddress?: WalletAddress;
}