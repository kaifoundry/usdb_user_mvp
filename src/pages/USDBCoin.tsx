import { useEffect, useState } from "react";
import Header from "../Layout/Header";
import BackgroundCanvas from "../components/backgroundCanvas";
import { useBTCPrice } from "../Hooks/useBTCPrice";
import NetworkBanner from "../components/networkBanner";
import { useWallet } from "../api/connectWallet";
import { getAddresses } from "../api/getAddresses";
import { getBalance } from "../api/getBalance";
import { signPsbt } from "../api/signPsbt";
import type { TabType } from "../types/tab";
import {
  FEE_REQUIRED_TO_MINT,
  MINT_AMOUNT,
  COLLATERAL_RATIO,
} from "../constants/appContsants";
import MintPanel from "../components/MintPanel";
import { getNetwork, type GetNetworkResponse } from "../api/getNetwork";
import WithdrawPanel from "../components/WithdrawPanel";
import MintModal from "../Modal/mintModal";
import type {
  MintApiResponse,
  MintData,
  OutputData,
} from "../types/mintApiResponse";
import WithdrawModal from "../Modal/withdrawModal";
import type {
  ConfirmationRequest,
  ConfirmationResponse,
} from "../interfaces/pages/usdbCoinInterface";
import type { VaultTransaction } from "../interfaces/pages/getTransactionInterface";
import type {
  LiquidationRequest,
  LiquidationResponse,
  LiquidationState,
} from "../interfaces/pages/liquidationInterface";
import { Button } from "../components/button";
import Tabs from "../components/tabs";

export default function USDBCoin() {
  const btcPrice = useBTCPrice();
  const { wallet } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>("mint");
  const [mintAmount, setMintAmount] = useState(MINT_AMOUNT.toFixed(2));
  const [collateralRatio, setCollateralRatio] = useState(COLLATERAL_RATIO);
  const [liquidationPrice, setLiquidationPrice] = useState("$0");
  const [requiredCollateralBTC, setRequiredCollateralBTC] = useState("--");
  const [error, setError] = useState("");
  const [selectedVaults, setSelectedVaults] = useState<string[]>([]);
  const [paymentAddress, setPaymentAddress] = useState<string | null>(null);
  const [networkResponse, setNetworkResponse] =
    useState<GetNetworkResponse | null>(null);
  const [getBalanceResult, setGetBalanceResult] = useState<string | null>(null);
  const [vaults, setVaults] = useState<VaultTransaction[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [modalOutputs, setModalOutputs] = useState<OutputData | null>(null);
  const [mintData, setMintData] = useState<MintData | null>(null);
  const [liquidationData, setLiquidationData] =
    useState<LiquidationState | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showWithDrawModal, setShowWithDrawModal] = useState(false);

  const handleTabChange = (tab: TabType) => setActiveTab(tab);


  useEffect(() => {
    if (wallet) {
      (async () => {
        const res = await getNetwork();
        if (res.status === "success") setNetworkResponse(res.result);

        const response = await getAddresses();
        if (response)
          setPaymentAddress(response.paymentAddress?.address || null);
      })();
    }
  }, [wallet]);

  useEffect(() => {
    if (paymentAddress) {
      (async () => {
        const response = await getBalance();
        setGetBalanceResult(response.paymentAddress?.total ?? null);
      })();
    }
  }, [paymentAddress]);

useEffect(() => {
  if (!btcPrice || btcPrice === 0) return;
  const requiredCollateral = Math.ceil((MINT_AMOUNT * COLLATERAL_RATIO / 100 / btcPrice) * 1e8) / 1e8;
  setMintAmount(MINT_AMOUNT.toFixed(2));
  setCollateralRatio(COLLATERAL_RATIO);
 setLiquidationPrice(`$${Math.ceil((btcPrice * 3) / 4)}`);
  setRequiredCollateralBTC(requiredCollateral.toFixed(8));
}, [btcPrice]);


 useEffect(() => {
  if (!getBalanceResult || requiredCollateralBTC === "--") return;

  const balanceInSats = parseFloat(getBalanceResult);
  if (isNaN(balanceInSats)) return;

  const availableBalance = balanceInSats / 100_000_000;
  const totalRequired = parseFloat(requiredCollateralBTC) + FEE_REQUIRED_TO_MINT;

  setError(availableBalance < totalRequired ? "Insufficient Balance" : "");
}, [getBalanceResult, requiredCollateralBTC]);


  const handleMint = async () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/mint/mint-btc-lock`;
    const destination = wallet?.ordinalsAddress?.address;
    const btcAddress = wallet?.paymentAddress?.address;
    const ordinalPublicKey = wallet?.ordinalsAddress?.publicKey;
    const paymentAddressPublicKey = wallet?.paymentAddress?.publicKey;

    console.log();
    if (!apiUrl || !destination || !btcAddress) {
      console.error("❌ Missing API URL or wallet addresses");
      return;
    }

    const payload = {
      destination,
      btcAddress,
      ordinalPublicKey,
      paymentAddressPublicKey,
    };
    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.error("❌ Mint API request failed:", response.statusText);
        return;
      }

      const data: MintApiResponse = await response.json();
      console.log("data mint:", data);
      setMintData({ data, paymentAddress: btcAddress });
      const outputsArray =
        data?.finalPsbt?.userVisibleOutputs?.map((outputObj) => {
          const address = Object.keys(outputObj)[0];
          const amount = outputObj[address];
          return {
            address,
            amount: `${amount} BTC`,
          };
        }) || [];

      setModalOutputs(outputsArray);
      setShowTransactionModal(true);
    } catch (err) {
      console.error("❌ Mint request error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePsbt = async () => {
    if (!mintData) {
      console.warn("⚠️ No mint data available.");
      return;
    }

    const { data, paymentAddress } = mintData;
    const modifiedPsbt = data.finalPsbt?.modifiedPsbt;
    const selectedInputs = data.finalPsbt?.selectedInputs;
    const vaultAddress = data.vault_address;

    if (!modifiedPsbt || !selectedInputs?.length) {
      console.error("❌ Invalid PSBT or inputs.");
      return;
    }

    const inputIndexes = selectedInputs.map((_, idx) => idx);
    const signInputs: Record<string, number[]> = {
      [paymentAddress]: inputIndexes,
    };

    setLoading(true);

    try {
      const signed = await signPsbt({
        psbtBase64: modifiedPsbt,
        signInputs,
        broadcast: true,
      });

      if (signed?.txid) {
        const confirmation = await checkTransactionConfirmation(
          signed.txid,
          paymentAddress,
          vaultAddress
        );

        // optionally handle confirmation result
        console.log("Confirmation status:", confirmation);
      }
    } catch (err) {
      console.error("❌ Signing or confirmation failed:", err);
    } finally {
      setShowTransactionModal(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentAddress && activeTab === "withdraw") {
      getVaultTransactions(paymentAddress);
    }
  }, [paymentAddress, activeTab]);

  const getVaultTransactions = async (
    paymentAddress: string
  ): Promise<VaultTransaction[]> => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/transaction/vault?payment_address=${paymentAddress}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch vault transactions: ${response.statusText}`
        );
      }

      const data: VaultTransaction[] = await response.json();
      setVaults(data);
      console.log("✅ Vault transactions:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching vault transactions:", error);
      throw error;
    }
  };

  const checkTransactionConfirmation = async (
    txid: string,
    paymentAddress: string,
    vaultAddress: string
  ): Promise<ConfirmationResponse> => {
    const requestBody: ConfirmationRequest = {
      txid,
      paymentAddress,
      vaultAddress,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/transaction/check/confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to check transaction confirmation: ${response.statusText}`
        );
      }

      const data: ConfirmationResponse = await response.json();
      console.log("✅ Transaction confirmation response:", data);
      return data;
    } catch (error) {
      console.error("❌ Error checking transaction confirmation:", error);
      throw error;
    }
  };

  const processedVaults = vaults.flatMap((vault) => {
    if (vault.usdb_amount > 10000) {
      const splits: VaultTransaction[] = [];
      let remaining = vault.usdb_amount;
      let index = 1;
      while (remaining > 0) {
        const chunk = remaining >= 10000 ? 10000 : remaining;
        splits.push({
          ...vault,
          id: Number(`${vault.id}${index}`), // make new unique ID
          usdb_amount: chunk,
        });
        remaining -= chunk;
        index++;
      }
      return splits;
    } else {
      return [vault];
    }
  });

  // const toggleVault = (id: string) => {
  //   setSelectedVaults((prev) =>
  //     prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
  //   );
  // };
  const toggleVault = (id: string) => {
    setSelectedVaults((prev) => (prev.includes(id) ? [] : [id]));
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedVaults([]);
    } else {
      const allIds = processedVaults
        .map((v) => v.id?.toString())
        .filter((id): id is string => !!id);
      setSelectedVaults(allIds);
    }
    setAllSelected(!allSelected);
  };

  useEffect(() => {
    setAllSelected(
      processedVaults.length > 0 &&
        selectedVaults.length === processedVaults.length
    );
  }, [selectedVaults, processedVaults]);

  const totalDebt = processedVaults
    .filter((v) => selectedVaults.includes(String(v.id)))
    .reduce((sum, v) => sum + Number(v.usdb_amount ?? 0), 0);

  const totalCollateral =
    processedVaults
      .filter((v) => selectedVaults.includes(String(v.id)))
      .reduce((sum) => sum + 5000, 0) / 100_000_000;

  const handleWithdraw = async (): Promise<void> => {
    const selectedVaultTxIds = processedVaults
      .filter((vault) => selectedVaults.includes(String(vault.id)))
      .map((vault) => vault.tx_id)
      .filter((txId): txId is string => !!txId);

    const payload: LiquidationRequest = {
      txid: selectedVaultTxIds.join(","),
      paymentAddress: wallet?.paymentAddress?.address ?? "",
      ordinalsAddress: wallet?.ordinalsAddress?.address ?? "",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/liquidation/liquidate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LiquidationResponse = await response.json();

      if (data && data.data) {
        const liquidationState: LiquidationState = {
          data: data.data,
          paymentAddress: payload.paymentAddress,
          ordinalsAddress: payload.ordinalsAddress,
        };

        setLiquidationData(liquidationState);
        setShowWithDrawModal(true);
      }

      console.log("✅ Liquidation Response:", data);
    } catch (error) {
      console.error("❌ Error during liquidation API call:", error);
    }
  };

  const handleWithdrawPsbt = async (): Promise<void> => {
    if (!liquidationData) {
      console.warn("⚠️ No liquidation data available.");
      return;
    }

    const {
      data: liquidationDetails,
      paymentAddress,
      ordinalsAddress,
    } = liquidationData;
    const psbtBase64 = liquidationDetails?.psbt;

    if (!psbtBase64) {
      console.error("❌ Missing PSBT data.");
      return;
    }

    if (!paymentAddress || !ordinalsAddress) {
      console.error("❌ Missing address data.");
      return;
    }

    setLoading(true);

    try {
      const signInputs: Record<string, number[]> = {
        [ordinalsAddress]: [0],
        [paymentAddress]: [1],
      };

      console.log("psbtBase64", psbtBase64);
      console.log("signInputs", signInputs);
      const signed = await signPsbt({
        psbtBase64,
        signInputs,
        broadcast: true,
      });

      console.log("🔄 Signing result:", signed);

      if (!signed || !signed.txid) {
        console.warn("⚠️ Transaction was not signed or broadcasted.");
        return;
      }

      console.log("✅ Signed and broadcasted TX:", signed.txid);

      try {
        const deleteUrl = `${
          import.meta.env.VITE_API_URL
        }/transaction/vault/delete/${signed.txid}`;
        const deleteRes = await fetch(deleteUrl, { method: "DELETE" });

        if (!deleteRes.ok) {
          throw new Error(`❌ Failed to delete vault: ${deleteRes.status}`);
        }

        console.log("🗑️ Vault deleted successfully.");
      } catch (deleteErr) {
        console.error("❌ Error deleting vault:", deleteErr);
      }
    } catch (err: any) {
      if (err?.message?.includes("User rejected")) {
        console.warn("❌ User rejected the PSBT signing request.");
      } else {
        console.error("❌ Signing or broadcasting failed:", err);
      }
    } finally {
      setShowTransactionModal(false);
      setLoading(false);
    }
  };


  // async function handleSign() {
  //   if (!paymentAddress) return;
  //   const result = await signMessage({
  //     address: paymentAddress,
  //     message: "Please sign this message for verification",
  //     protocol: MessageSigningProtocols.ECDSA,
  //   });
  //   console.log(result);
  // }

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundCanvas />
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-32 relative z-10">
        <NetworkBanner
          networkName={networkResponse?.bitcoin?.name ?? "Testnet"}
        />

        <div className="w-full max-w-lg mx-auto">
          <div className="app-card rounded-2xl p-2 md:px-8 md:pb-6">
        <Tabs activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="relative overflow-hidden min-h-[400px]">
              <div
                className="flex w-[200%] transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(${
                    activeTab === "mint" ? "0%" : "-50%"
                  })`,
                }}
              >
                 {error && (
        <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
      )}
                <div className="w-1/2 shrink-0 px-4">
                  <MintPanel
                    mintAmount={Number(mintAmount)}
                    collateralRatio={collateralRatio}
                    liquidationPrice={liquidationPrice}
                    requiredCollateralBTC={requiredCollateralBTC}
                    btcPrice={btcPrice}
                    feeRequiredToMint={FEE_REQUIRED_TO_MINT}
                  />
                </div>

                <div className="w-1/2 shrink-0 px-4">
                  <WithdrawPanel
                    vaults={processedVaults}
                    selectedVaults={selectedVaults}
                    toggleVault={toggleVault}
                    toggleSelectAll={toggleSelectAll}
                    allSelected={allSelected}
                    totalDebt={totalDebt}
                    totalCollateral={totalCollateral}
                  />
                </div>
              </div>
            </div>

            <Button
              activeTab={activeTab}
              loading={loading}
              handleMint={handleMint}
              handleWithdraw={handleWithdraw}
            />
          </div>
        </div>
        {/* {modalOutputs && ( */}
        <MintModal
          show={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          handlePsbt={handlePsbt}
          // outputs={modalOutputs}
        />
        {/* )}/ */}
        <WithdrawModal
          show={showWithDrawModal}
          onClose={() => setShowWithDrawModal(false)}
          handleWithdrawPsbt={handleWithdrawPsbt}
        />
      </main>
    </div>
  );
}
