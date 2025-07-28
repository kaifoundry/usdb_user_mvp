import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import Header from "../Layout/Header";
import BackgroundCanvas from "../components/backgroundCanvas";
import { useWallet } from "../api/connectWallet";
import { getAddresses } from "../api/getAddresses";
import { getBalance } from "../api/getBalance";
// import { signMessage } from "../api/signMessage";
// import { MessageSigningProtocols } from "sats-connect";
import { signPsbt } from "../api/signPsbt";
import { getRunesBalance, type RuneBalance } from "../api/getRunesBalance";
import type { TabType } from "../types/tab";
import {
  MIN_COLLATERAL_RATIO,
  MOCK_BTC_PRICE,
  MOCK_SATOSHI_PER_BTC,
} from "../constants/appContsants";
import MintPanel from "../components/MintPanel";
import useBTCConverter from "../Hooks/useBTCConverter";
import { getNetwork, type GetNetworkResponse } from "../api/getNetwork";
import WithdrawPanel from "../components/WithdrawPanel";
import MintModal from "../Modal/mintModal";
import toast from "react-hot-toast";
import type {
  MintApiResponse,
  MintData,
  OutputData,
} from "../types/mintApiResponse";
import type { CombinedTransactionStatus, TransactionApiResponse } from "../types/transactionApiResponse";

export default function USDBCoin() {
  const { satsToBtc } = useBTCConverter();
  const [activeTab, setActiveTab] = useState<TabType>("mint");
  const [btcDeposit, setBtcDeposit] = useState(satsToBtc(MOCK_SATOSHI_PER_BTC));
  const [btcDepositSats, setBtcDepositSats] = useState("--");
  const [mintAmount, setMintAmount] = useState("1000");
  const [collateralRatio, setCollateralRatio] = useState(
    MIN_COLLATERAL_RATIO.toString()
  );
  const [liquidationPrice, setLiquidationPrice] = useState("$0.00");
  const [requiredCollateralBTC, setRequiredCollateralBTC] = useState("--");
  const [requiredCollateralSATs, setRequiredCollateralSATs] = useState("5000");
  const [selectedVaults, setSelectedVaults] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [paymentAddress, setPaymentAddress] = useState<string | null>(null);
  const [networkResponse, setNetworkResponse] =
    useState<GetNetworkResponse | null>(null);
  const [getBalanceResult, setGetBalanceResult] = useState<string | null>(null);
  const { wallet } = useWallet();
  const [vaults, setVaults] = useState<RuneBalance[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [modalOutputs, setModalOutputs] = useState<OutputData | null>(null);
  const [mintData, setMintData] = useState<MintData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionStatus, setTransactionStatus] =
    useState<CombinedTransactionStatus | null>(null);

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
    const inputAmount = parseFloat(btcDeposit);
    if (isNaN(inputAmount)) {
      setError("");
      return;
    }
    if (getBalanceResult === null) return;

    const availableBalance = Number(getBalanceResult) / 100_000_000;
    setError(inputAmount > availableBalance ? "Insufficient Balance" : "");
  }, [btcDeposit, getBalanceResult]);

  useEffect(() => {
    if (wallet) {
      (async () => {
        const result = await getRunesBalance();
        console.log("Vaults:", result);
        if (result) setVaults(result);
      })();
    }
  }, [wallet]);

  useEffect(() => {
    const btc = parseFloat(btcDeposit);
    if (!btc || btc <= 0) {
      setMintAmount("1000");
      setCollateralRatio("--");
      setLiquidationPrice("$0.00");
      setBtcDepositSats("--");
      setRequiredCollateralBTC("--");
      setRequiredCollateralSATs("--");
      return;
    }

    const mintable = 1000; // fixed
    const collateralValueUSD = btc * MOCK_BTC_PRICE;
    const actualRatio = (collateralValueUSD / mintable) * 100;

    setMintAmount(mintable.toFixed(0));
    setCollateralRatio(`${actualRatio.toFixed(0)}`);

    const liquidation = mintable / btc;
    setLiquidationPrice(`$${liquidation.toFixed(2)}`);

    const sats = btc * 100_000_000;
    setBtcDepositSats(sats.toFixed(0));

    const requiredBTC = (mintable * MIN_COLLATERAL_RATIO) / MOCK_BTC_PRICE;
    const requiredSATs = requiredBTC * 100_000_000;

    setRequiredCollateralBTC(requiredBTC.toFixed(8));
    setRequiredCollateralSATs(requiredSATs.toFixed(0));
  }, [btcDeposit]);

  const handleMint = async () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/mint-btc-lock`;
    const destination = wallet?.ordinalsAddress?.address;
    const btcAddress = wallet?.paymentAddress?.address;

    if (!apiUrl || !destination || !btcAddress) {
      console.error("❌ Missing API URL or wallet addresses");
      return;
    }

    const payload = { destination, btcAddress };
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
      console.log("data:", data);
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
      if (signed?.psbt) {
        toast.success("✅ PSBT signed successfully!");
        console.log("✅ Signed PSBT:", signed.psbt);
      }

      if (signed?.txid) {
        console.log("📡 Broadcasted TXID:", signed.txid);
      }
    } catch (err) {
      console.error("❌ Signing failed:", err);
    } finally {
      setShowTransactionModal(false);
      setLoading(false);
    }
  };

  const processedVaults = vaults.flatMap((vault) => {
    if (vault.amount > 1000) {
      const splits: RuneBalance[] = [];
      let remaining = vault.amount;
      let index = 1;
      while (remaining > 0) {
        const chunk = remaining >= 1000 ? 1000 : remaining;
        splits.push({
          ...vault,
          id: `${vault.id}-${index}`,
          amount: chunk,
        });
        remaining -= chunk;
        index++;
      }
      return splits;
    } else {
      return [vault];
    }
  });

  const toggleVault = (id: string) => {
    setSelectedVaults((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedVaults([]);
    } else {
      const allIds = processedVaults
        .map((v) => v.id)
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
    .filter((v) => v.id && selectedVaults.includes(v.id))
    .reduce((sum, v) => sum + Number(v.amount ?? 0), 0);

  const totalCollateral =
    processedVaults
      .filter((v) => v.id && selectedVaults.includes(v.id))
      .reduce((sum, _) => sum + 5000, 0) / 100_000_000;

useEffect(() => {
  const fetchTxStatus = async (): Promise<void> => {
    const selectedInputs = mintData?.data?.finalPsbt?.selectedInputs;
    const txids = selectedInputs?.map((input) => input?.txid).filter(Boolean);

    if (!txids || txids.length === 0) {
      console.error("❌ TXIDs are missing");
      return;
    }

    const networkName = networkResponse?.bitcoin?.name?.toLowerCase();
    const network =
      networkName === "mainnet"
        ? ""
        : networkName === "testnet3"
        ? "testnet"
        : networkName;

    const primaryApiUrl = `${import.meta.env.VITE_NETWORK_API_URL}/${network}/api/tx/${txids[0]}/status`;

    const mempoolBase = `${import.meta.env.VITE_NETWORK_API_URL}/${network}/api/v1/transaction-times`;
    const mempoolQuery = txids.map((id) => `txId[]=${id}`).join("&");
    console.log("Fetching mempool data with query:", mempoolQuery);
    const mempoolUrl = `${mempoolBase}?${mempoolQuery}`;

    try {
      const [primaryResponse, mempoolResponse] = await Promise.all([
        fetch(primaryApiUrl),
        fetch(mempoolUrl),
      ]);

      if (!primaryResponse.ok || !mempoolResponse.ok) {
        throw new Error(
          `HTTP error(s): ${primaryResponse.status}, ${mempoolResponse.status}`
        );
      }

      const primaryData: TransactionApiResponse = await primaryResponse.json();
      const mempoolTimestamps: number[] = await mempoolResponse.json();

      const combinedStatus: CombinedTransactionStatus = {
        primary: primaryData,
        mempoolTimestamps,
      };

      setTransactionStatus(combinedStatus);
      console.log("✅ Combined Transaction Status:", combinedStatus);
    } catch (error) {
      console.error("❌ Error fetching transaction statuses:", error);
    }
  };

  if (mintData && networkResponse) {
    fetchTxStatus();
  }
}, [mintData, networkResponse]);


 

  const handleWithdraw = () => {
    if (selectedVaults.length === 0) {
      alert("Select at least one vault to withdraw.");
      return;
    }
    alert(`Withdrawal submitted for ${selectedVaults.length} vault(s).`);
  };

  const handleTabChange = (tab: TabType) => setActiveTab(tab);

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
      <Header
        show={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />

      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-32 relative z-10">
        <div className="test-net-text border md:border-[1.2px] border-dashed bg-[rgba(255,149,0,0.2)] border-[rgba(255,149,0,0.32)] rounded-xl md:rounded-2xl py-2.5 md:px-4 md:py-2 w-full max-w-lg mx-auto mb-4 flex items-center justify-center gap-2">
          <Wrench size={19} />
          <span>
            You are in {`${networkResponse?.bitcoin?.name ?? "Testnet"}`} mode
          </span>
        </div>

        <div className="w-full max-w-lg mx-auto">
          <div className="app-card rounded-2xl p-2 md:px-8 md:pb-6">
            <div
              className="flex border-b"
              style={{ borderColor: "var(--card-border-color)" }}
            >
              <button
                onClick={() => handleTabChange("mint")}
                className={`tab flex-1 py-3 text-base font-medium ${
                  activeTab === "mint" ? "active" : ""
                }`}
              >
                Mint
              </button>
              <button
                onClick={() => handleTabChange("withdraw")}
                className={`tab flex-1 py-3 text-base font-medium ${
                  activeTab === "withdraw" ? "active" : ""
                }`}
              >
                Withdraw
              </button>
            </div>

            <div className="relative overflow-hidden min-h-[400px]">
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
                    btcDeposit={btcDeposit}
                    error={error}
                    getBalanceResult={getBalanceResult}
                    mintAmount={Number(mintAmount)}
                    collateralRatio={collateralRatio}
                    liquidationPrice={liquidationPrice}
                    requiredCollateralBTC={requiredCollateralBTC}
                    requiredCollateralSATs={requiredCollateralSATs}
                    handleBtcDeposit={setBtcDeposit}
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
                    handleWithdraw={handleWithdraw}
                    transactionStatus={transactionStatus}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={activeTab === "mint" ? handleMint : handleWithdraw}
              disabled={loading}
              className={`w-full mt-6 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600"
              } text-black font-bold py-4 rounded-lg text-lg`}
            >
              {loading
                ? "Processing..."
                : activeTab === "mint"
                ? "Mint USDB"
                : "Withdraw Selected"}
            </button>
          </div>
        </div>

        {/* <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        /> */}

        {modalOutputs && (
          <MintModal
            show={showTransactionModal}
            onClose={() => setShowTransactionModal(false)}
            handlePsbt={handlePsbt}
            outputs={modalOutputs}
          />
        )}
      </main>
    </div>
  );
}
