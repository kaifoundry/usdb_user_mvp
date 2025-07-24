import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import Header from "../Layout/Header";
import BackgroundCanvas from "../components/backgroundCanvas";
import SuccessModal from "../Modal/successModal";
import { useWallet } from "../api/connectWallet";
import { getAddresses } from "../api/getAddresses";
import { getBalance } from "../api/getBalance";
import { signMessage } from "../api/signMessage";
import { MessageSigningProtocols } from "sats-connect";
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [error, setError] = useState("");
  const [paymentAddress, setPaymentAddress] = useState<string | null>(null);
  const [networkResponse, setNetworkResponse] =
    useState<GetNetworkResponse | null>(null);
  const [getBalanceResult, setGetBalanceResult] = useState<string | null>(null);
  const { wallet } = useWallet();
  const [vaults, setVaults] = useState<RuneBalance[]>([]);
  const [allSelected, setAllSelected] = useState(false);

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
    (async () => {
      const result = await getRunesBalance();
      if (result) setVaults(result);
    })();
  }, []);

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

  const toggleVault = (id: string) => {
    setSelectedVaults((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedVaults([]);
    } else {
      setSelectedVaults(
        vaults.map((v) => v.id).filter((id): id is string => !!id)
      );
    }
    setAllSelected(!allSelected);
  };

  useEffect(() => {
    setAllSelected(
      vaults.length > 0 && selectedVaults.length === vaults.length
    );
  }, [selectedVaults, vaults]);

  const totalDebt = vaults
    .filter((v) => v.id && selectedVaults.includes(v.id))
    .reduce((sum, v) => sum + Number(v.amount ?? 0), 0);

  const totalCollateral =
    vaults
      .filter((v) => v.id && selectedVaults.includes(v.id))
      .reduce((sum) => sum + 5000, 0) / 100_000_000;

  const handleWithdraw = () => {
    if (selectedVaults.length === 0) {
      alert("Select at least one vault to withdraw.");
      return;
    }
    alert(`Withdrawal submitted for ${selectedVaults.length} vault(s).`);
  };

  const handleTabChange = (tab: TabType) => setActiveTab(tab);

  const handleMint = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const payload = {
      destination: wallet?.ordinalsAddress?.address,
      btcAddress: wallet?.paymentAddress?.address,
    };
    if (!apiUrl || !payload.destination || !payload.btcAddress) return;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("🔗 API Response:", response);
    const data = await response.json();
    if (data) await handlePsbt(data, payload.btcAddress);
  };

  const handlePsbt = async (
    data: { modifiedPsbt: string; selectedInputs: any[] },
    paymentAddress: string
  ) => {
    const { modifiedPsbt, selectedInputs } = data;
    const inputIndexes: number[] = selectedInputs.map((_, index) => index);
    const signInputs: Record<string, number[]> = {
      [paymentAddress]: inputIndexes,
    };
    const signed = await signPsbt({
      psbtBase64: modifiedPsbt,
      signInputs,
      broadcast: true,
    });

    if (signed) {
      console.log("✅ Signed PSBT:", signed.psbt);
      if (signed.txid) {
        console.log("📡 Broadcasted TXID:", signed.txid);
      }
    }
  };

  async function handleSign() {
    if (!paymentAddress) return;
    const result = await signMessage({
      address: paymentAddress,
      message: "Please sign this message for verification",
      protocol: MessageSigningProtocols.ECDSA,
    });
    console.log(result);
  }


  const handleTransaction = () => {
    setShowTransactionModal(true);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundCanvas />
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-32 relative z-10">
        <div className="test-net-text border md:border-[1.2px] border-dashed bg-[rgba(255,149,0,0.2)] border-[rgba(255,149,0,0.32)] rounded-xl md:rounded-2xl py-2.5 md:px-4 md:py-2 w-full max-w-lg mx-auto mb-4 flex items-center justify-center gap-2">
          <Wrench size={19} />
          <span>You are in {`${networkResponse?.bitcoin?.name}`} mode</span>
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
                    vaults={vaults}
                    selectedVaults={selectedVaults}
                    toggleVault={toggleVault}
                    toggleSelectAll={toggleSelectAll}
                    allSelected={allSelected}
                    totalDebt={totalDebt}
                    totalCollateral={totalCollateral}
                    handleWithdraw={handleWithdraw}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={activeTab === "mint" ? handleMint : handleWithdraw}
              className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-lg text-lg"
            >
              {activeTab === "mint" ? "Mint USDB" : "Withdraw Selected"}
            </button>
            {activeTab === "mint" && (
              <button
                onClick={handleTransaction}
                className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-lg text-lg"
              >
                Transaction
              </button>
            )}
          </div>
        </div>

        {/* <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        /> */}

        <MintModal
          show={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          outputs={{
            Address1: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            Amount1: "2 BTC",
            Address2: "0x742d35Cc6585C42c7C3ce7C3C0C3e1b1e52c9b2d",
            Amount2: "6,500 USDB",
          }}
        />
      </main>
    </div>
  );
}
