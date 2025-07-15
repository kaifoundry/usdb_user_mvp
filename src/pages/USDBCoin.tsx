import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import logo from "../assets/btclogo.svg";
import Header from "../Layout/Header";
import BackgroundCanvas from "../components/backgroundCanvas";
import SuccessModal from "../Modal/successModal";
const MOCK_BTC_PRICE = 65000;
const MIN_COLLATERAL_RATIO = 2.0;
const MOCK_WALLET = {
  address: "bc1q...xyuv",
  btcBalance: 2.5,
  usdbBalance: 10000,
};
const MOCK_VAULTS = [
  { id: 1, debt: 200, collateral: 0.006154 },
  { id: 2, debt: 500, collateral: 0.015385 },
  { id: 3, debt: 100, collateral: 0.003077 },
  { id: 4, debt: 1000, collateral: 0.030769 },
];

function USDBCoin() {
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "light" ||
      localStorage.getItem("theme") === "dark"
      ? (localStorage.getItem("theme") as "light" | "dark")
      : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark"
  );

  const [activeTab, setActiveTab] = useState<"mint" | "withdraw">("mint");
  const [prevTab, setPrevTab] = useState<"mint" | "withdraw">("mint");
  const [btcDeposit, setBtcDeposit] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [collateralRatio, setCollateralRatio] = useState("--");
  const [liquidationPrice, setLiquidationPrice] = useState("$0.00");
  const [selectedVaults, setSelectedVaults] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Theme handling
  useEffect(() => {
    document.body.classList.toggle("light-mode", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Update calculations
  useEffect(() => {
    const btc = parseFloat(btcDeposit);
    if (!btc || btc <= 0) {
      setMintAmount("");
      setCollateralRatio("--");
      setLiquidationPrice("$0.00");
      return;
    }
    const collateralValue = btc * MOCK_BTC_PRICE;
    const maxMint =
      Math.floor(collateralValue / MIN_COLLATERAL_RATIO / 100) * 100;
    setMintAmount(maxMint.toFixed(2));
    setCollateralRatio(((collateralValue / maxMint) * 100).toFixed(0));
    const liquidation = (maxMint * 1.25) / btc;
    setLiquidationPrice(`$${liquidation.toFixed(2)}`);
  }, [btcDeposit]);
  const toggleVaultSelection = (id: number) => {
    setSelectedVaults((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };
  const totalSelectedDebt = MOCK_VAULTS.filter((v) =>
    selectedVaults.includes(v.id)
  ).reduce((sum, v) => sum + v.debt, 0);
  const totalSelectedCollateral = MOCK_VAULTS.filter((v) =>
    selectedVaults.includes(v.id)
  ).reduce((sum, v) => sum + v.collateral, 0);

  const handleWithdraw = () => {
    if (selectedVaults.length === 0)
      return alert("Please select at least one vault to withdraw.");
    const totalDebt = MOCK_VAULTS.filter((v) =>
      selectedVaults.includes(v.id)
    ).reduce((sum, v) => sum + v.debt, 0);
    alert(
      `Withdrawal submitted for ${
        selectedVaults.length
      } vault(s). Total to repay: ${totalDebt.toFixed(2)} USDB.`
    );
  };

  const handleTabChange = (tab: "mint" | "withdraw") => {
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  const handleMint = () => {
    setShowSuccessModal(true);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundCanvas theme={theme} />

      <Header
        theme={theme}
        setTheme={setTheme}
        MOCK_WALLET={MOCK_WALLET}
        logo={logo}
        toggleTheme={toggleTheme}
      />

      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-32 relative z-10">
        <div className="test-net-text border md:border-[1.2px] border-dashed bg-[rgba(255,149,0,0.2)] border-[rgba(255,149,0,0.32)] rounded-xl  md:rounded-2xl py-2.5 md:px-4 md:py-2 w-full max-w-lg mx-auto mb-4 flex items-center justify-center gap-2">
          <Wrench size={19} />
          <span>You are in testnet mode</span>
        </div>
        <div className="w-full max-w-lg mx-auto">
          {/* <div className="flex items-center justify-center gap-[10px] rounded-xl p-1 ">
            <button
              className={`px-6 w-[120px] py-3 rounded-xl font-semibold transition-colors ${
                activeTab === "mint" ? "bg-[#262626]" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("mint")}
            >
              Mint
            </button>
            <button
              className={`px-6 w-[120px] py-3 rounded-xl font-semibold transition-colors ${
                activeTab === "withdraw" ? " bg-[#262626] " : "text-gray-400"
              }`}
              onClick={() => setActiveTab("withdraw")}
            >
              Withdraw
            </button>
          </div> */}

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
                <div className="w-full shrink-0">
                  {/* Mint Panel */}
                  <div className="mt-6 space-y-4">
                    {/* <div>
                      <label className="text-sm text-muted">Deposit BTC</label>
                      <div className="relative mt-1">
                        <input
                         type="number"
                          value={btcDeposit}
                          onChange={(e) => setBtcDeposit(e.target.value)}
                          placeholder="0.0"
                          className="app-input app-input-readonly w-full p-4 pr-20 rounded-lg text-2xl focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-muted">
                          BTC
                        </span>
                        <div className="text-xs text-right text-muted mt-1">
                        Balance: {MOCK_WALLET.btcBalance}
                      </div>
                      </div>
                    </div>
                   

                    <div className="text-center text-2xl font-light">↓</div>
                  
                     <div>
                      <label className="text-sm text-muted">
                        Mint USDB (in multiples of 100)
                      </label>
                      <div className="relative mt-1">
                        <input
                          type="number"
                          value={mintAmount}
                          readOnly
                          placeholder="0.0"
                          className="app-input w-full p-4 pr-24 rounded-lg text-2xl bg-opacity-50 focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-muted">
                          USDB
                        </span>
                       
                      </div>
                    </div> */}
                    <div className="">
                      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm z-20">
              <span className="text-gray-400">↓</span>
            </div> */}

                      <div className=" rounded-lg p-6  mt-6 app-input">
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={btcDeposit}
                            onChange={(e) => setBtcDeposit(e.target.value)}
                            placeholder="Deposit BTC"
                            className="flex-1 bg-transparent text-xl text-gray-400 placeholder-gray-400 focus:outline-none focus:text-gray-900 font-normal"
                          />
                          <span className="text-muted font-medium ml-4">
                            BTC
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-3 text-right">
                          Balance: {MOCK_WALLET.btcBalance}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 w-[62px] h-[54px] app-card rounded-[12px] flex items-center justify-center shadow-md z-10 gap-2.5 opacity-100">
                          <span className="text-lg ">↓</span>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 mt-2 app-input app-input-readonly">
                          <div className="flex items-center relative ">
                            <input
                              type="text"
                              value={btcDeposit}
                              onChange={(e) => setBtcDeposit(e.target.value)}
                              readOnly
                              // className="flex-1 bg-transparent text-xl text-gray-400 placeholder-gray-400 focus:outline-none focus:text-gray-900 font-normal"
                              className="flex-1 bg-transparent   w-full p-4 pr-20 rounded-lg text-2xl focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                            {!btcDeposit && (
                              <div className="absolute left-0 pointer-events-none flex-1">
                                <span className="text-xl text-gray-400 font-normal">
                                  Mint USDB
                                </span>
                                <span className="text-sm text-gray-400 ml-2">
                                  (in multiples of 100)
                                </span>
                              </div>
                            )}
                            <span className="text-muted font-medium ml-4">
                              USDB
                            </span>
                          </div>
                        </div>
                        {/* Mint USDB */}
                      </div>
                    </div>
                    <div className="text-sm text-muted space-y-2">
                      <div className="flex justify-between">
                        <span>BTC Price</span>
                        <span>${MOCK_BTC_PRICE}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Collateral Ratio</span>
                        <span>{collateralRatio}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Liquidation Price</span>
                        <span>{liquidationPrice}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleMint}
                      className="w-full mt-21 bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-lg text-lg"
                    >
                      Mint USDB
                    </button>
                  </div>
                </div>
                <div className="w-full shrink-0">
                  {/* Withdraw Panel */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-muted">
                        Select vaults to close
                      </label>
                      <input
                        type="checkbox"
                        className="vault-checkbox w-5 h-5 pr-2"
                        checked={selectedVaults.length === MOCK_VAULTS.length}
                        onChange={() => {
                          if (selectedVaults.length === MOCK_VAULTS.length) {
                            setSelectedVaults([]);
                          } else {
                            setSelectedVaults(MOCK_VAULTS.map((v) => v.id));
                          }
                        }}
                      />
                    </div>

                    <div className="mt-2 space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
                      {MOCK_VAULTS.map((vault) => (
                        <div
                          key={vault.id}
                          // className="vault-item flex items-center justify-between p-4 rounded-lg"
                          className={`vault-item flex items-center justify-between p-4 rounded-lg ${
                            selectedVaults.includes(vault.id)
                              ? "vault-item-selected"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              className="vault-checkbox  w-5 h-5"
                              checked={selectedVaults.includes(vault.id)}
                              onChange={() => toggleVaultSelection(vault.id)}
                            />
                            <div>
                              <div className="font-semibold">
                                Vault #{vault.id}
                              </div>
                              <div className="text-sm text-muted">
                                Collateral: {vault.collateral.toFixed(6)} BTC
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {vault.debt.toFixed(2)} USDB
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
                          <span>{totalSelectedDebt.toFixed(2)} USDB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Collateral to Withdraw</span>
                          <span>{totalSelectedCollateral.toFixed(6)} BTC</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleWithdraw}
                      className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-lg text-lg"
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
          theme={theme}
        />
      </main>
    </div>
  );
}

export default USDBCoin;
