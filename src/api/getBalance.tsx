import { useState, useCallback, useEffect } from "react";
import { request, RpcErrorCode } from "sats-connect";
import { ensureXverseContext } from "../Hooks/useMobileSignIn";
import type { PaymentBalance } from "../interfaces/api/getBalanceInterface";
import { useWallet } from "./connectWallet";

export const useGetBalance = () => {
  const [balance, setBalance] = useState<PaymentBalance | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { wallet } = useWallet();

  const fetchBalance = useCallback(async () => {
    if (!wallet?.paymentAddress?.address) {
      console.warn("No wallet or payment address found.");
      return null;
    }

    setLoadingBalance(true);
    setError(null);

    try {
      try {
        ensureXverseContext();
      } catch (e) {
        console.warn("ensureXverseContext triggered redirect or failed:", e);
        throw e;
      }
      const response = await request("getBalance", null);

      if (response.status === "success") {
        const paymentAddress: PaymentBalance = {
          confirmed: response.result.confirmed,
          unconfirmed: response.result.unconfirmed,
          total: response.result.total,
        };
        setBalance(paymentAddress);
        return { paymentAddress };
      } else {
        const code = response.error?.code;
        const message = response.error?.message ?? "Unknown wallet error";
        if (code === RpcErrorCode.USER_REJECTION) {
          throw new Error("User rejected the request.");
        }
        throw new Error(`Wallet error: ${message}`);
      }
    } catch (err: any) {
      console.error("getBalance error:", err);
      setError(err?.error?.message || err.message || "Unknown error");
      throw err;
    } finally {
      setLoadingBalance(false);
    }
  }, [wallet]);

  // ✅ Call automatically when wallet changes
  useEffect(() => {
    if (wallet?.paymentAddress?.address) {
      fetchBalance();
    }
  }, [wallet, fetchBalance]);

  return { balance, loadingBalance, error, fetchBalance };
};
