export interface WalletAddressItem {
  purpose: any; 
  address: string;
  publicKey: string; 
}

export interface ConnectWalletResult {
  paymentAddress?: WalletAddressItem;
  ordinalsAddress?: WalletAddressItem;
  stacksAddress?: WalletAddressItem;
}
export interface WalletContextType {
  wallet: ConnectWalletResult | null;
  loading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}