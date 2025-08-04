import React, { createContext, useContext, useState, useCallback } from "react";
import { request, AddressPurpose, RpcErrorCode } from "sats-connect";

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

/**
 * Call sats-connect and resolve wallet addresses.
 */
export const connectWalletApi = async (): Promise<ConnectWalletResult> => {
  try {
    const response = await request("wallet_connect", null);

    if (response.status === "success") {
      const paymentAddressItem = response.result.addresses.find(
        (address: any) => address.purpose === AddressPurpose.Payment
      );
      const ordinalsAddressItem = response.result.addresses.find(
        (address: any) => address.purpose === AddressPurpose.Ordinals
      );
      const stacksAddressItem = response.result.addresses.find(
        (address: any) => address.purpose === AddressPurpose.Stacks
      );

      console.log({ name: "connectWallet", paymentAddressItem, ordinalsAddressItem, stacksAddressItem });
      return {
        paymentAddress: paymentAddressItem,
        ordinalsAddress: ordinalsAddressItem,
        stacksAddress: stacksAddressItem,
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

export const disconnectWalletApi = async (): Promise<void>  => {
  try {
    await request("wallet_disconnect", null); 
    console.log('Xverse wallet disconnected');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to disconnect Xverse wallet:', error.message);
    } else {
      console.error('Failed to disconnect Xverse wallet:', error);
    }
  }
};

interface WalletContextType {
  wallet: ConnectWalletResult | null;
  loading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  loading: false,
  error: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<ConnectWalletResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await connectWalletApi();
      setWallet(result);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await disconnectWalletApi();
      setWallet(null);
      console.log('Wallet disconnected successfully');
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, loading, error, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
