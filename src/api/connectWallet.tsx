import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { request, AddressPurpose, RpcErrorCode } from "sats-connect";
import type { ConnectWalletResult, WalletContextType } from "../interfaces/api/connectWalletInterface";
import { useEnsureXverseContext, ensureXverseContext } from "../Hooks/useMobileSignIn";
import toast from "react-hot-toast";

export const connectWalletApi = async (): Promise<ConnectWalletResult> => {
  try {
    try {
      ensureXverseContext();
    } catch (e) {
      console.warn("ensureXverseContext triggered redirect or failed:", e);
      throw e;
    }

    const response = await request("wallet_connect", null);

    if (response.status === "success") {
      toast.success("Wallet connected successfully");

      const paymentAddressItem = response.result.addresses.find(
        (address: any) => address.purpose === AddressPurpose.Payment
      );
      const ordinalsAddressItem = response.result.addresses.find(
        (address: any) => address.purpose === AddressPurpose.Ordinals
      );
      const stacksAddressItem = response.result.addresses.find(
        (address: any) => address.purpose === AddressPurpose.Stacks
      );

      if (!paymentAddressItem) {
        throw new Error("Payment address not found in wallet connection response.");
      }

      console.log({ name: "connectWallet", paymentAddressItem, ordinalsAddressItem, stacksAddressItem });

      // 🔥 Backend API Call
      const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/wallet/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentAddress: paymentAddressItem.address,
          paymentAddressPublicKey: paymentAddressItem.publicKey,
        }),
      });

      const apiData = await apiResponse.json();

      if (apiData.success === true) {
        toast.success(apiData.message || "Wallet registered successfully.");
        return {
        paymentAddress: paymentAddressItem,
        ordinalsAddress: ordinalsAddressItem,
        stacksAddress: stacksAddressItem,
      };
      } else {
        toast.error(apiData.message || "Failed to register wallet.");
        throw new Error(apiData.message || "Wallet registration failed.");
      }

      
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


export const disconnectWalletApi = async (): Promise<void> => {
  try {
    try {
      ensureXverseContext();
    } catch (e) {
      console.warn("ensureXverseContext triggered redirect or failed:", e);
      throw e;
    }
    await request("wallet_disconnect", null);
    console.log("Xverse wallet disconnected");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to disconnect Xverse wallet:", error.message);
    } else {
      console.error("Failed to disconnect Xverse wallet:", error);
    }
  }
};

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  loading: false,
  error: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ensureXverseContext = useEnsureXverseContext();
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
  }, [ensureXverseContext]);

  const disconnectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await disconnectWalletApi();
      setWallet(null);
      console.log("Wallet disconnected successfully");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ wallet, loading, error, connectWallet, disconnectWallet }),
    [wallet, loading, error, connectWallet, disconnectWallet]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => useContext(WalletContext);
