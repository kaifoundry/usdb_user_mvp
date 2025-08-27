import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { request, AddressPurpose, RpcErrorCode } from "sats-connect";
import type { ConnectWalletResult, WalletAddressItem, WalletContextType } from "../interfaces/api/connectWalletInterface";
import { useEnsureXverseContext, ensureXverseContext } from "../Hooks/useMobileSignIn";



// export const connectWalletApi = async (): Promise<ConnectWalletResult> => {
//   try {
//     try {
//       ensureXverseContext();
//     } catch (e) {
//       console.warn("ensureXverseContext triggered redirect or failed:", e);
//       throw e;
//     }

//     const response = await request("wallet_connect", null);

//     if (response.status === "success") {
//       const paymentAddressItem = response.result.addresses.find(
//         (address: any) => address.purpose === AddressPurpose.Payment
//       );
//       const ordinalsAddressItem = response.result.addresses.find(
//         (address: any) => address.purpose === AddressPurpose.Ordinals
//       );
//       const stacksAddressItem = response.result.addresses.find(
//         (address: any) => address.purpose === AddressPurpose.Stacks
//       );

//       console.log({ name: "connectWallet", paymentAddressItem, ordinalsAddressItem, stacksAddressItem });
//       return {
//         paymentAddress: paymentAddressItem,
//         ordinalsAddress: ordinalsAddressItem,
//         stacksAddress: stacksAddressItem,
//       };
//     } else {
//       if (response.error.code === RpcErrorCode.USER_REJECTION) {
//         throw new Error("User rejected wallet connection.");
//       } else {
//         throw new Error(`Wallet error: ${response.error.message}`);
//       }
//     }
//   } catch (err: any) {
//     throw new Error(err?.error?.message || err.message || "Unknown error");
//   }
// };


import SignClient from "@walletconnect/sign-client";

export function ConnectXverseButton() {
  const [loading, setLoading] = useState(false);

  const connectXverse = useCallback(async () => {
    setLoading(true);
    try {
      const signClient = await SignClient.init({
        projectId: "0c14fcbc9b77217d8c74ebe629b21ea7",
        metadata: {
          name: "BTC Stablecoin DApp",
          description: "DApp description",
          url: "https://0e18b220834b.ngrok-free.app",
          icons: ["https://0e18b220834b.ngrok-free.app/icon.png"]
        }
      });

      const { uri, approval } = await signClient.connect({
        requiredNamespaces: {
          stacks: {
            methods: [
              "stacks_signMessage",
              "stacks_stxTransfer",
              "stacks_contractCall",
              "stacks_contractDeploy"
            ],
            chains: ["stacks:1", "stacks:2147483648"],
            events: []
          },
          bip122: {
            methods: ["bitcoin_btcTransfer"],
            chains: [
              "bip122:000000000019d6689c085ae165831e93",
              "bip122:000000000933ea01ad0ee984209779ba"
            ],
            events: []
          }
        }
      });

      if (uri) {
        const xverseUniversalLink =
          `https://connect.xverse.app/browser?uri=${encodeURIComponent(uri)}`;
        window.location.href = xverseUniversalLink;
      }

      const session = await approval();

      const stacksAccounts = session.namespaces.stacks?.accounts || [];
      const bitcoinAccounts = session.namespaces.bip122?.accounts || [];
      alert([
        "Stacks addresses: " + stacksAccounts.map(a => a.split(":")[2]).join(", "),
        "BTC addresses: " + bitcoinAccounts.map(a => a.split(":")[2]).join(", ")
      ].join("\n"));
    } catch (err) {
      alert("Connection failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <button disabled={loading} onClick={connectXverse}>
      {loading ? "Connecting..." : "Connect with Xverse"}
    </button>
  );
}

// detect mobile
const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
// const isXverseBrowser = () => /Xverse/i.test(navigator.userAgent);
export const connectWalletApi = async (): Promise<ConnectWalletResult> => {
  try {
    //     if (isMobile() && !isXverseBrowser()) {
    //       // Not inside Xverse → use Universal Link to open Xverse app
    //       const signClient = await SignClient.init({
    //         projectId: "0c14fcbc9b77217d8c74ebe629b21ea7",
    //         metadata: {
    //           name: "BTC Stablecoin",
    //           description: "USDB DApp",
    //           url: "https://06a0d07d5587.ngrok-free.app", 
    //           icons: ["https://btcstablecoin.kaifoundry.com/logo.png"],
    //         },
    //       });

    if (isMobile()) {
      // --- WalletConnect v2 flow for mobile ---
      const signClient = await SignClient.init({
        projectId: "0c14fcbc9b77217d8c74ebe629b21ea7",
        metadata: {
          name: "BTC Stablecoin",
          description: "USDB DApp",
          // url: "https://btcstablecoin.kaifoundry.com",
          url: "https://06a0d07d5587.ngrok-free.app",
          icons: ["https://06a0d07d5587.ngrok-free.app/logo.png"],
        },
      });

      // const { uri, approval } = await signClient.connect({
      //   requiredNamespaces: {
      //     bitcoin: {
      //       methods: ["stx_signMessage", "stx_signTransaction"],
      //       chains: ["stacks:1"],
      //       events: [],
      //     },
      //   },
      // });
      const { uri, approval } = await signClient.connect({
        requiredNamespaces: {
          stacks: {              
            methods: ["stx_signMessage", "stx_signTransaction"],
            chains: ["stacks:1"],
            events: [],
          },
          bitcoin: {
            methods: ["btc_signMessage", "btc_signTransaction"],
            chains: ["bip122:000000000019d6689c085ae165831e93"],
            events: [],
          },
        },
      });


      // if (uri) {
      //   alert(`URI: ${uri}`);
      //   console.log("WalletConnect URI:", uri); // check in console
      //   window.location.href = `xverse://wc?uri=${encodeURIComponent(uri)}`;
      // } else {
      //   throw new Error("Failed to generate WalletConnect URI");
      // }
      if (uri) {
        alert(`URI: ${encodeURIComponent(uri)}`);
        // setTimeout(() => {
        //   // window.location.href = `xverse://wc?uri=${encodeURIComponent(uri)}`;
        //   //  window.location.href = `https://connect.xverse.app/browser?url=${encodeURIComponent(uri)}`;
        // }, 500);
        // window.location.href = `https://connect.xverse.app/browser?uri=${encodeURIComponent(uri)}`;
         window.location.href = `xverse://wc?uri=${encodeURIComponent(uri)}`;
      }


      const session = await approval();

      // Map WalletConnect session accounts -> WalletAddressItem
      // Usually accounts look like "stacks:1:<address>"
      // const accounts = session.namespaces.bitcoin.accounts;

      const accounts = session.namespaces.stacks.accounts; // ← change from .bitcoin to .stacks

      const paymentAddress: WalletAddressItem = {
        purpose: "payment",
        address: accounts[0].split(":")[2] ?? "",
        publicKey: "",
      };

      return {
        paymentAddress,
        ordinalsAddress: undefined,
        stacksAddress: undefined,
      };

    } else {
      ensureXverseContext();
      const response = await request("wallet_connect", null);

      if (response.status === "success") {
        const paymentAddressItem = response.result.addresses.find(
          (a: any) => a.purpose === AddressPurpose.Payment
        );
        const ordinalsAddressItem = response.result.addresses.find(
          (a: any) => a.purpose === AddressPurpose.Ordinals
        );
        const stacksAddressItem = response.result.addresses.find(
          (a: any) => a.purpose === AddressPurpose.Stacks
        );

        return {
          paymentAddress: paymentAddressItem as WalletAddressItem,
          ordinalsAddress: ordinalsAddressItem as WalletAddressItem,
          stacksAddress: stacksAddressItem as WalletAddressItem,
        };
      } else {
        if (response.error.code === RpcErrorCode.USER_REJECTION) {
          throw new Error("User rejected wallet connection.");
        }
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
  connectWallet: async () => { },
  disconnectWallet: async () => { },
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


