import { useEffect, useState } from "react";
import Header from "../Layout/Header";
import BackgroundCanvas from "../components/backgroundCanvas";
import { useBTCPrice } from "../Hooks/useBTCPrice";
import NetworkBanner from "../components/networkBanner";
import { useWallet } from "../api/connectWallet";
import { useGetBalance } from "../api/getBalance";
import { signPsbt } from "../api/signPsbt";
import type { AuctionTabType, TabType } from "../types/tab";
import {
  FEE_REQUIRED_TO_MINT,
  MINT_AMOUNT,
  COLLATERAL_RATIO,
} from "../constants/appContsants";
import MintPanel from "../components/MintPanel";
import { useNetwork } from "../api/getNetwork";
import WithdrawPanel from "../components/WithdrawPanel";
import MintModal from "../Modal/mintModal";
import type { MintApiResponse, MintData } from "../types/mintApiResponse";
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
import useBTCConverter from "../Hooks/useBTCConverter";
import {
  AuctionHistoryVault,
  type HistoricalVault,
} from "../components/auctionHistory";
import { TransactionModal } from "../Modal/transactionSuccessModal";
import { AuctionVaultList } from "../components/auctionVaultList";

export default function USDBCoin() {
  const { btcPrice, lastUpdated } = useBTCPrice();
  const { satsToBtc } = useBTCConverter();
  const { balance } = useGetBalance();
  const { wallet, connectWallet } = useWallet();
  const network = useNetwork();
  const [activeTab, setActiveTab] = useState<TabType>("mint");
  const [showAuctionTabs, setShowAuctionTabs] = useState(false); // track auction toggle
  const [activeAuctionTab, setActiveAuctionTab] =
    useState<AuctionTabType>("live");
  const [mintAmount, setMintAmount] = useState(MINT_AMOUNT.toFixed(2));
  const [collateralRatio, setCollateralRatio] = useState(COLLATERAL_RATIO);
  const [liquidationPrice, setLiquidationPrice] = useState("$0");
  const [requiredCollateralBTC, setRequiredCollateralBTC] = useState("--");
  const [error, setError] = useState("");
  const [selectedVaults, setSelectedVaults] = useState<string[]>([]);
  const [vaults, setVaults] = useState<VaultTransaction[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [mintData, setMintData] = useState<MintData | null>(null);
  const [liquidationData, setLiquidationData] =
    useState<LiquidationState | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showWithDrawModal, setShowWithDrawModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const handleTabChange = (tab: TabType) => setActiveTab(tab);
  // const handleAuctionLinkClick = () => {
  //   setShowAuctionTabs(true); // show auction tabs
  //   setActiveAuctionTab("live"); // default to live
  // };

  useEffect(() => {
    if (!btcPrice || btcPrice === 0) return;
    const requiredCollateral =
      Math.ceil(((MINT_AMOUNT * COLLATERAL_RATIO) / 100 / btcPrice) * 1e8) /
      1e8;
    setMintAmount(MINT_AMOUNT.toFixed(2));
    setCollateralRatio(COLLATERAL_RATIO);
    setLiquidationPrice(`$${Math.ceil((btcPrice * 3) / 4)}`);
    setRequiredCollateralBTC(requiredCollateral.toFixed(8));
  }, [btcPrice]);

  useEffect(() => {
    if (balance?.total == null || requiredCollateralBTC === "--") return;

    const balanceInSats = parseFloat(balance?.total);
    if (isNaN(balanceInSats)) return;

    const availableBalance = parseFloat(satsToBtc(balanceInSats));
    const totalRequired =
      parseFloat(requiredCollateralBTC) + FEE_REQUIRED_TO_MINT;

    setError(availableBalance < totalRequired ? "Insufficient Balance" : "");
  }, [balance?.total, requiredCollateralBTC]);

  const handleMint = async () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/mint/mint-btc-lock`;
    const ordinalAddress = wallet?.ordinalsAddress?.address;
    const paymentAddress = wallet?.paymentAddress?.address;
    const ordinalPublicKey = wallet?.ordinalsAddress?.publicKey;
    const paymentAddressPublicKey = wallet?.paymentAddress?.publicKey;
    const collateralRequired = Number(requiredCollateralBTC);
    const priceTimestamp = lastUpdated;

    if (!apiUrl || !ordinalAddress || !paymentAddress) {
      console.error("❌ Missing API URL or wallet addresses");
      return;
    }

    const payload = {
      ordinalAddress,
      paymentAddress,
      ordinalPublicKey,
      paymentAddressPublicKey,
      collateralRequired,
      btcPrice,
      priceTimestamp,
    };

    console.log("payload", payload);
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

      const apiResponse = await response.json();

      // Map API response to our MintApiResponse type
      const data: MintApiResponse = {
        message: apiResponse.message,
        psbt: apiResponse.data.psbt,
        vaultAddress: apiResponse.data.vaultAddress,
        collateralRequired: apiResponse.data.collateralRequired,
        btcPrice: apiResponse.data.btcPrice,
        priceTimestamp: apiResponse.data.priceTimestamp,
      };

      console.log("data mint:", data);
      setMintData({ data, paymentAddress: paymentAddress });
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
    const modifiedPsbt = data?.psbt?.modifiedPsbt;
    const totalInputs = data?.psbt?.totalInputs;
    const vaultAddress = data?.vaultAddress;
    const collateralRequired = data?.collateralRequired;
    const btcPrice = data?.btcPrice;
    const priceTimestamp = data?.priceTimestamp;

    if (!modifiedPsbt || !totalInputs) {
      console.error("❌ Invalid PSBT or inputs.");
      return;
    }

    const inputIndexes = Array.from({ length: totalInputs }, (_, idx) => idx);
    const signInputs: Record<string, number[]> = {
      [paymentAddress]: inputIndexes,
    };

    setLoading(true);

    try {
      const mintTimestamp = Math.floor(Date.now() / 1000);
      const signed = await signPsbt({
        psbtBase64: modifiedPsbt,
        signInputs,
        broadcast: true,
      });

      if (signed?.txid) {
        const confirmation = await checkTransactionConfirmation(
          signed.txid,
          paymentAddress,
          vaultAddress,
          collateralRequired,
          btcPrice,
          priceTimestamp,
          mintTimestamp
        );
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
    if (wallet?.paymentAddress?.address && activeTab === "withdraw") {
      fetchVaultTransactions(wallet?.paymentAddress?.address);
    }
  }, [wallet?.paymentAddress?.address, activeTab]);

  const fetchVaultTransactions = async (
    address: string
  ): Promise<VaultTransaction[]> => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/transaction/vault?payment_address=${address}`;

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
      console.log("✅ Vault transactions:", data);

      setVaults(data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching vault transactions:", error);
      throw error;
    }
  };

  const checkTransactionConfirmation = async (
    txid: string,
    paymentAddress: string,
    vaultAddress: string,
    collateralRequired: number,
    btcPrice: number,
    priceTimestamp: number,
    mintTimestamp: number
  ): Promise<ConfirmationResponse> => {
    const requestBody: ConfirmationRequest = {
      txid,
      paymentAddress,
      vaultAddress,
      collateralRequired,
      btcPrice,
      priceTimestamp,
      mintTimestamp,
    };
    console.log("requestBody", requestBody);
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
      if (data?.message === "Transaction found but not yet confirmed") {
        await fetchVaultTransactions(wallet?.paymentAddress?.address ?? "");
      }
      console.log("✅ Transaction confirmation response:", data);
      return data;
    } catch (error) {
      console.error("❌ Error checking transaction confirmation:", error);
      throw error;
    }
  };

  const processedVaults = vaults.flatMap((vault) => {
    const vaultWithLocked = {
      ...vault,
      btc_locked: vault.collateral_required ?? 0,
    };

    if (vaultWithLocked.usdb_amount > 10) {
      const splits: VaultTransaction[] = [];
      let remaining = vaultWithLocked.usdb_amount;
      let index = 1;
      while (remaining > 0) {
        const chunk = remaining >= 10 ? 10 : remaining;
        splits.push({
          ...vaultWithLocked,
          id: Number(`${vaultWithLocked.id}${index}`),
          usdb_amount: chunk,
        });
        remaining -= chunk;
        index++;
      }
      return splits;
    } else {
      return [vaultWithLocked];
    }
  });

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

  const totalCollateral = processedVaults
    .filter((v) => selectedVaults.includes(String(v.id)))
    .reduce((sum, v) => sum + Number(v.collateral_required ?? 0), 0);

  const selectedVaultData = processedVaults.filter((v) =>
    selectedVaults.includes(String(v.id))
  );

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
    console.log("payload", payload);
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
          txid: data?.txid,
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
      txid,
    } = liquidationData;
    const psbtBase64 = liquidationDetails?.psbt;
    const mintTxid = txid;

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
        [paymentAddress]: [1],
        [ordinalsAddress]: [0],
      };

      const signed = await signPsbt({
        psbtBase64,
        signInputs,
        broadcast: false,
      });

      if (!signed?.psbt) {
        console.warn("⚠️ No signed PSBT returned.");
        return;
      }
      setShowWithDrawModal(false);
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }/transaction/sendtransaction`;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedPsbt: signed.psbt,
          mintTxid,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`❌ API request failed: ${res.status}`);
      }
      if (data.success && data.sendRaxtxResult) {
        setTransactionId(data.sendRaxtxResult);
        setIsModalOpen(true);
      }
    } catch (err: any) {
      if (err?.message?.includes("User rejected")) {
        console.warn("❌ User rejected the PSBT signing request.");
      } else {
        console.error("❌ Signing or sending failed:", err);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);

    if (wallet?.paymentAddress?.address) {
      fetchVaultTransactions(wallet.paymentAddress.address);
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
  const mockVaults = [
    {
      id: "1",
      vaultId: "#1",
      liquidationStarted: "Aug 7, 11:12am",
      timeLeft: "11 mint 14 sec left",
      txId: "7345e1234567890abcdef1234567890abcdef9008",
      vaultCollateral: {
        amount: "0.015",
        currency: "BTC",
      },
      lot: {
        amount: "10",
        currency: "USDB",
      },
      currentClaimPrice: {
        amount: "2300",
        unit: "sats",
        currency: "1 USDB",
      },
    },
    {
      id: "2",
      vaultId: "#1",
      liquidationStarted: "Aug 7, 11:12am",
      timeLeft: "11 mint 14 sec left",
      txId: "7345e1234567890abcdef1234567890abcdef9008",
      vaultCollateral: {
        amount: "0.015",
        currency: "BTC",
      },
      lot: {
        amount: "10",
        currency: "USDB",
      },
      currentClaimPrice: {
        amount: "2300",
        unit: "sats",
        currency: "1 USDB",
      },
    },
  ];
  const mockHistoricalVaults: HistoricalVault[] = [
    {
      id: "1",
      vaultId: "#006",
      date: "Aug 6",
      btcCollateral: "0.001 BTC",
      finalBid: "11.200",
      walletAddress: "014h1234567890abcdef1234567890abcdef98hju",
    },
    {
      id: "2",
      vaultId: "#897",
      date: "Aug 12",
      btcCollateral: "0.78 BTC",
      finalBid: "12.500",
      walletAddress: "014h1234567890abcdef1234567890abcdef98hju",
    },
    {
      id: "3",
      vaultId: "#897",
      date: "Aug 12",
      btcCollateral: "0.78 BTC",
      finalBid: "10.400",
      walletAddress: "014h1234567890abcdef1234567890abcdef98hju",
    },
    {
      id: "4",
      vaultId: "#006",
      date: "Aug 6",
      btcCollateral: "0.001 BTC",
      finalBid: "11.200",
      walletAddress: "014h1234567890abcdef1234567890abcdef98hju",
    },
    {
      id: "5",
      vaultId: "#897",
      date: "Aug 12",
      btcCollateral: "0.78 BTC",
      finalBid: "12.500",
      walletAddress: "014h1234567890abcdef1234567890abcdef98hju",
    },
    {
      id: "6",
      vaultId: "#897",
      date: "Aug 12",
      btcCollateral: "0.78 BTC",
      finalBid: "10.400",
      walletAddress: "014h1234567890abcdef1234567890abcdef98hju",
    },
  ];

  const handleClaim = () => {
    // console.log(`Claiming vault ${vaultId}`);
    // Add your claim logic here
  };
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundCanvas />
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-32 relative z-10">
        <NetworkBanner
          networkName={
            network?.status === "success" ? network.bitcoin : "Testnet"
          }
        />

        <div className="w-full max-w-lg mx-auto">
          <div className="app-card rounded-2xl p-2 md:px-8 md:pb-6">
            <Tabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              setShowAuctionTabs={setShowAuctionTabs}
              showAuctionTabs={showAuctionTabs}
              activeAuctionTab={activeAuctionTab}
              setActiveAuctionTab={setActiveAuctionTab}
            />

            <div className="relative overflow-hidden min-h-[400px]">
              {showAuctionTabs ? (
                <div
                  className="flex w-[200%] transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(${
                      activeAuctionTab === "live" ? "0%" : "-50%"
                    })`,
                  }}
                >
                  <div className="w-1/2 shrink-0 px-4">
                    <AuctionVaultList
                      vaults={mockVaults}
                      onClaim={handleClaim}
                    />
                  </div>
                  <div className="w-1/2 shrink-0 px-4">
                    <AuctionHistoryVault vaults={mockHistoricalVaults} />
                  </div>
                </div>
              ) : (
                <div
                  className="flex w-[200%] transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(${
                      activeTab === "mint" ? "0%" : "-50%"
                    })`,
                  }}
                >
                  <div className="w-1/2 shrink-0 px-4">
                    <MintPanel
                      mintAmount={Number(mintAmount)}
                      collateralRatio={collateralRatio}
                      liquidationPrice={liquidationPrice}
                      requiredCollateralBTC={requiredCollateralBTC}
                      btcPrice={btcPrice}
                      feeRequiredToMint={FEE_REQUIRED_TO_MINT}
                      Error={error}
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
              )}
            </div>

            {/* Only show Mint/Withdraw button if NOT in Auction */}
            {!showAuctionTabs && (
              <Button
                activeTab={activeTab}
                loading={loading}
                handleMint={handleMint}
                handleWithdraw={handleWithdraw}
                connectWallet={connectWallet}
                wallet={wallet}
                Error={error}
              />
            )}

            <div className="text-center mt-4">
              <button
                onClick={() => setShowAuctionTabs((prev) => !prev)}
                className="text-gray-500 hover:text-gray-700 underline text-sm"
              >
                Switch to {showAuctionTabs ? "Mint / Withdraw" : "Auction"}
              </button>
            </div>
          </div>
        </div>
        <MintModal
          show={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          handlePsbt={handlePsbt}
          outputs={mintData}
        />
        <WithdrawModal
          show={showWithDrawModal}
          onClose={() => setShowWithDrawModal(false)}
          handleWithdrawPsbt={handleWithdrawPsbt}
          vaults={selectedVaultData}
        />
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transactionId={transactionId}
          handleCloseModal={handleCloseModal}
        />
      </main>
    </div>
  );
}
