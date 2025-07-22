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
import { MIN_COLLATERAL_RATIO, MOCK_BTC_PRICE, MOCK_VAULTS } from "../constants/appContsants";
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
const [getRunesBalanceResult, setGetRunesBalanceResult] = useState<RuneBalance[] | null>(null);

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

  const handleMint = () => {
    setShowSuccessModal(true);
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

  async function handlePsbt() {
    const signed = await signPsbt({
      psbtBase64: "cHNidP8BAHECAAAA...",
      signInputs: {
        "1ef9...Jn1r": [0],
        "bc1p...ra4w": [1, 2],
      },
      broadcast: false,
    });

    if (signed) {
      console.log("Signed PSBT:", signed.psbt);
      if (signed.txid) {
        console.log("Broadcasted TXID:", signed.txid);
      }
    }
  }

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
      <BackgroundCanvas  />
      <Header/>

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
          handleMint={() => setShowSuccessModal(true)}
          handlePsbt={handlePsbt}
          handleSign={handleSign}
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
                      { getRunesBalanceResult && getRunesBalanceResult.map((vault) => (
                        <div
                          key={vault.id}
                          className={`vault-item flex items-center justify-between p-4 rounded-lg ${
                            selectedVaults.includes(vault.id?? "")
                              ? "vault-item-selected"
                              : ""
                          }`}
                        >
                          {/* Header with status and timestamp */}
                          {/* {vault.status && (
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center px-3 py-0.5 rounded-lg text-base font-normal ${getStatusStyle(
                                    vault.status || ""
                                  )}`}
                                >
                                  {vault.status}
                                </span>
                                <div className="flex items-center  text-sm gap-1 font-normal text-[#666666]">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M2 8C2 9.18669 2.35189 10.3467 3.01118 11.3334C3.67047 12.3201 4.60754 13.0892 5.7039 13.5433C6.80026 13.9974 8.00666 14.1162 9.17054 13.8847C10.3344 13.6532 11.4035 13.0818 12.2426 12.2426C13.0818 11.4035 13.6532 10.3344 13.8847 9.17054C14.1162 8.00666 13.9974 6.80026 13.5433 5.7039C13.0892 4.60754 12.3201 3.67047 11.3334 3.01118C10.3467 2.35189 9.18669 2 8 2C6.32263 2.00631 4.71265 2.66082 3.50667 3.82667L2 5.33333"
                                      stroke="#DBDBDB"
                                      stroke-opacity="0.9"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M2 2V5.33333H5.33333"
                                      stroke="#DBDBDB"
                                      stroke-opacity="0.9"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M8 4.66675V8.00008L10.6667 9.33341"
                                      stroke="#DBDBDB"
                                      stroke-opacity="0.9"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                  {vault.timestamp}
                                </div>
                              </div>

                              <div className="flex items-center text-base font-normal text-[#308F00]">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                                <span className="ml-1 ">6+</span>
                              </div>
                            </div>
                          )} */}
                          <div className=" flex  items-center justify-between">
                            <div className="flex items-center gap-4">
                              <input
                                type="checkbox"
                                className="vault-checkbox w-5 h-5"
                                checked={selectedVaults.includes(vault.id ?? "")}
                                onChange={() => toggleVaultSelection(vault.id ?? "")}
                              />
                              <div>
                                <div className="font-semibold">
                                  Vault #{vault.id}
                                </div>
                                <div className="text-sm text-muted">
                                  Collateral: 5000 BTC
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {vault.amount}  {vault.runeName}
                              </div>
                              <div className="text-sm text-muted">Debt</div>
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              className="vault-checkbox w-5 h-5"
                              checked={selectedVaults.includes(vault.id?? "")}
                              onChange={() => toggleVaultSelection(vault.id?? "")}
                            />
                            <div>
                              <div className="font-semibold">Vault #{vault.id}</div>
                              <div className="text-sm text-muted">
                                Collateral: --- BTC
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {vault.amount} {vault.runeName}
                            </div>
                          </div>
                        </div>
                        
                      {/* ))} */}
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
                  
                 ) )}
                </div>
                
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
