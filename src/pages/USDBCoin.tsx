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
  MOCK_VAULTS,
} from "../constants/appContsants";
import MintPanel from "../components/MintPanel";
import useBTCConverter from "../Hooks/useBTCConverter";


function USDBCoin() {
  const { satsToBtc, btcToSats } = useBTCConverter();
  const sats = 5000;
  const btc = satsToBtc(sats);
  const [activeTab, setActiveTab] = useState<TabType>("mint");
  const [btcDeposit, setBtcDeposit] = useState(btc);
  const [btcDepositSats, setBtcDepositSats] = useState("--");
  const [mintAmount, setMintAmount] = useState("1000");
  const [collateralRatio, setCollateralRatio] = useState("--");
  const [liquidationPrice, setLiquidationPrice] = useState("$0.00");
  const [requiredCollateralBTC, setRequiredCollateralBTC] = useState("--");
  const [requiredCollateralSATs, setRequiredCollateralSATs] = useState("5000");
  const [selectedVaults, setSelectedVaults] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [paymentAddress, setPaymentAddress] = useState<string | null>(null);
  const [getBalanceResult, setGetBalanceResult] = useState<string | null>(null);
  const { wallet } = useWallet();
  const [getRunesBalanceResult, setGetRunesBalanceResult] = useState<
    RuneBalance[] | null
  >(null);

  useEffect(() => {
    if (wallet) {
      (async () => {
        const response = await getAddresses();
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

  //   const handleBtcDeposit = (value: string) => {
  //   setBtcDeposit(value);

  //   const inputAmount = parseFloat(value);
  //   if (isNaN(inputAmount)) {
  //     setError("");
  //     return;
  //   }
  //   const availableBalance = Number(getBalanceResult) / 100_000_000;

  //   if (inputAmount > availableBalance) {
  //     setError("Insufficient Balance");
  //   } else {
  //     setError("");
  //   }
  // };
  useEffect(() => {
    const inputAmount = parseFloat(btcDeposit);
    if (isNaN(inputAmount)) {
      setError("");
      return;
    }

    if (getBalanceResult === null) {
      return;
    }

    const availableBalance = Number(getBalanceResult) / 100_000_000;

    if (inputAmount > availableBalance) {
      setError("Insufficient Balance");
    } else {
      setError("");
    }
  }, [btcDeposit, getBalanceResult]);
  const handleBtcDeposit = (value: string) => {
    setBtcDeposit(value);
  };

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const result = await getRunesBalance();
        if (result) {
          setGetRunesBalanceResult(result);
          console.log("Rune Balances:", result);
        } else {
          console.log("No rune balances returned.");
        }
      } catch (err) {
        console.log("Error fetching rune balances:", err);
      }
    };

    fetchBalances();
  }, []);

  useEffect(() => {
    const btc = parseFloat(btcDeposit);
    if (!btc || btc <= 0) {
      setMintAmount("");
      setCollateralRatio("--");
      setLiquidationPrice("$0.00");
      setBtcDepositSats("--");
      setRequiredCollateralBTC("--");
      setRequiredCollateralSATs("--");
      return;
    }

    const collateralValueUSD = btc * MOCK_BTC_PRICE;

    const mintable =
      Math.floor(collateralValueUSD / MIN_COLLATERAL_RATIO / 100) * 100;

    setMintAmount(mintable.toFixed(0));

    const actualRatio =
      mintable > 0 ? (collateralValueUSD / mintable) * 100 : 0;
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

  const toggleVaultSelection = (vaultKey: string) => {
    setSelectedVaults((prev) =>
      prev.includes(vaultKey)
        ? prev.filter((v) => v !== vaultKey)
        : [...prev, vaultKey]
    );
  };

  // const totalSelectedDebt = getRunesBalanceResult
  //   ?.filter((v) => selectedVaults.includes(v.inscriptionId || v.runeName))
  //   .reduce((sum, v) => sum + (v.debt || 0), 0) || 0;

  // const totalSelectedCollateral = getRunesBalanceResult
  //   ?.filter((v) => selectedVaults.includes(v.inscriptionId || v.runeName))
  //   .reduce((sum, v) => sum + (v.collateral || 0), 0) || 0;

  const handleWithdraw = () => {
    if (selectedVaults.length === 0)
      return alert("Please select at least one vault to withdraw.");
    // alert(
    //   `Withdrawal submitted for ${selectedVaults.length} vault(s). Total to repay:
    //   ${totalSelectedDebt.toFixed(
    //     2
    //   )}
    //    USDB.`
    // );
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

const handleMint = async () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    console.error("API URL is not defined in environment variables.");
    return {
      success: false,
      message: "API URL is not defined.",
    };
  }

  const payload = {
    destination: wallet?.ordinalsAddress?.address,
    btcAddress: wallet?.paymentAddress?.address,
  };

  console.log("🔍 Sending payload:", payload);

  if (!payload.destination || !payload.btcAddress) {
    console.error("❌ Missing destination or btcAddress in payload.");
    return {
      success: false,
      message: "Missing destination or btcAddress in payload.",
    };
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API responded with error:", errorText);
      throw new Error(`HTTP ${response.status} — ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ API response:", data);

    // ---- Call handlePsbt after successful mint ----
    if (data){
    await handlePsbt(data?.finalPsbt,payload.btcAddress);
  }
    return {
      success: true,
      data,
    };

  } catch (error: unknown) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};



  async function handleSign() {
    if (!paymentAddress) {
      console.error("Payment address is null or undefined");
      return;
    }

    const result = await signMessage({
      address: paymentAddress,
      message: "Please sign this message for verification",
      protocol: MessageSigningProtocols.ECDSA,
    });

    if (result) {
      console.log("Signature:", result.signature);
      console.log("Message Hash:", result.messageHash);
      console.log("Signed by Address:", result.address);
    } else {
      console.log("Signing failed or cancelled.");
    }
  }

 const handlePsbt = async (
  data: { modifiedPsbt: string; selectedInputs: any[] },
  paymentAddress: string
) => {
  const { modifiedPsbt ,selectedInputs} = data;
const inputIndexes: number[] = selectedInputs.map((_, index) => index);
console.log("inputIndexes:", inputIndexes);
  // 🔑 Record<string, number[]> — keys: addresses, values: input indexes
  const signInputs: Record<string, number[]> = {
    [paymentAddress]: inputIndexes,
  };

  console.log("🖊️ Signing with:", { signInputs });

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



  //status
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "In Progress":
        return " status-text status-box";
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Failed":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "hidden";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundCanvas />
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-32 relative z-10">
        <div className="test-net-text border md:border-[1.2px] border-dashed bg-[rgba(255,149,0,0.2)] border-[rgba(255,149,0,0.32)] rounded-xl md:rounded-2xl py-2.5 md:px-4 md:py-2 w-full max-w-lg mx-auto mb-4 flex items-center justify-center gap-2">
          <Wrench size={19} />
          <span>You are in testnet mode</span>
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
                className="flex w-full transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(${
                    activeTab === "mint" ? "0%" : "-100%"
                  })`,
                }}
              >
                 <MintPanel
          btcDeposit={btcDeposit}
          error={error}
          getBalanceResult={getBalanceResult}
          mintAmount={1000}
          collateralRatio={collateralRatio}
          liquidationPrice={liquidationPrice}
          requiredCollateralBTC={requiredCollateralBTC}
          requiredCollateralSATs={requiredCollateralSATs}
          handleBtcDeposit={setBtcDeposit}
          handleMint={handleMint}
        />

                <div className="w-full shrink-0">
                  {/* Withdraw Panel */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-muted">
                        Select vaults to close
                      </label>
                      {/* <input
                        type="checkbox"
                        className="vault-checkbox w-5 h-5 pr-2"
                        checked={selectedVaults.length === getRunesBalanceResult.length}
                        onChange={() => {
                          if (selectedVaults.length === MOCK_VAULTS.length) {
                            setSelectedVaults([]);
                          } else {
                            setSelectedVaults(MOCK_VAULTS.map((v) => v.id));
                          }
                        }}
                      /> */}
                    </div>

                    <div className="mt-2 space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
                      {getRunesBalanceResult &&
                        getRunesBalanceResult.map((vault) => (
                          <div
                            key={vault.id}
                            className={`vault-item flex justify-between p-4 rounded-lg ${
                              selectedVaults.includes(vault.id ?? "")
                                ? "vault-item-selected"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="checkbox"
                                className="vault-checkbox w-5 h-5"
                                checked={selectedVaults.includes(
                                  vault.id ?? ""
                                )}
                                onChange={() =>
                                  toggleVaultSelection(vault.id ?? "")
                                }
                              />
                              <div>
                                <div className="font-semibold">
                                  Vault #{vault.id}
                                </div>
                                <div className="text-sm text-muted">
                                  Collateral: {`${satsToBtc(5000)}`} BTC
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {vault.amount} {vault.runeName}
                              </div>
                              <div className="text-sm text-muted">Debt</div>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div
                      className="mt-6 pt-4 border-t"
                      style={{ borderColor: "var(--card-border-color)" }}
                    >
                      <div className="text-lg font-semibold mb-4">Summary</div>
                      <div className="text-sm text-muted space-y-2">
                        <div className="flex justify-between">
                          <span>Total to Repay</span>
                          {/* <span>{totalSelectedDebt.toFixed(2)} USDB</span> */}
                        </div>
                        <div className="flex justify-between">
                          <span>Collateral to Withdraw</span>
                          {/* <span>{totalSelectedCollateral.toFixed(6)} BTC</span> */}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleWithdraw}
                      className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-lg text-lg"
                    >
                      Withdraw Selected
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      </main>
    </div>
  );
}

export default USDBCoin;
