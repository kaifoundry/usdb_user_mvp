import { useEffect, useRef, useState } from "react";
import { Wrench } from "lucide-react";
import logo from "../assets/btclogo.svg";
import Header from "../Layout/HeaderMain";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem("theme") === "light" || localStorage.getItem("theme") === "dark")
      ? (localStorage.getItem("theme") as 'light' | 'dark')
      : (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark")
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
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleColor =
      theme === "light" ? "rgba(55, 65, 81, 0.3)" : "rgba(251, 191, 36, 0.3)";
    const num = (canvas.width * canvas.height) / 9000;
    const particles = Array.from({ length: num }, () =>
      createParticle(canvas.width, canvas.height, particleColor)
    );

    function draw() {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.sx;
        p.y += p.sy;
        if (p.x < 0 || p.x > canvas.width) p.sx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.sy *= -1;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    draw();
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [theme]);

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
      <canvas
        ref={canvasRef}
        id="particle-canvas"
        className="fixed top-0 left-0 w-full h-screen -z-10"
      />

      <Header
        theme={theme}
        setTheme={setTheme}
        MOCK_WALLET={MOCK_WALLET}
        logo={logo}
        toggleTheme={toggleTheme}
        
      />

      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-24 relative z-10">
        <div className="border-[1.2px] bg-[rgba(255,149,0,0.2)] border-[rgba(255,149,0,0.32)]   rounded-2xl px-4 py-2 w-full max-w-lg mx-auto mb-4 flex items-center justify-center gap-2">
          <Wrench size={19} />

          <span>You are in testnet mode</span>
        </div>
        <div className="w-full max-w-lg mx-auto">
          <div className="app-card rounded-2xl p-6 md:p-8">
            <div
              className="flex border-b"
              style={{ borderColor: "var(--card-border-color)" }}
            >
              <button
                onClick={() => handleTabChange("mint")}
                className={`tab flex-1 py-3 text-lg font-semibold ${
                  activeTab === "mint" ? "active" : ""
                }`}
              >
                Mint
              </button>
              <button
                onClick={() => handleTabChange("withdraw")}
                className={`tab flex-1 py-3 text-lg font-semibold ${
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
                    <div>
                      <label className="text-sm text-muted">Deposit BTC</label>
                      <div className="relative mt-1">
                        <input
                          type="number"
                          value={btcDeposit}
                          onChange={(e) => setBtcDeposit(e.target.value)}
                          placeholder="0.0"
                          className="app-input w-full p-4 pr-20 rounded-lg text-2xl focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-muted">
                          BTC
                        </span>
                      </div>
                      <div className="text-xs text-right text-muted mt-1">
                        Balance: {MOCK_WALLET.btcBalance}
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
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-lg text-lg"
                    >
                      Mint USDB
                    </button>
                  </div>
                </div>
                <div className="w-full shrink-0">
                  {/* Withdraw Panel */}
                  <div className="mt-6">
                    <label className="text-sm text-muted">
                      Select vaults to close
                    </label>
                    <div className="mt-2 space-y-3 max-h-60 overflow-y-auto pr-2">
                      {MOCK_VAULTS.map((vault) => (
                        <div
                          key={vault.id}
                          className="vault-item flex items-center justify-between p-4 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              className="vault-checkbox w-5 h-5"
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
        {showSuccessModal && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ${
              theme === "light" ? "bg-white/80" : "bg-black/80"
            }`}
          >
            <div
              className="p-8 rounded-xl text-center shadow-lg w-full max-w-3xl h-[340px] mx-4 flex flex-col items-center justify-center"
              style={{ backgroundColor: "var(--bg-color)" }}
            >
              <div>
                <h2 className="text-2xl font-medium mb-2">
                  Minting transaction submitted!
                </h2>
                <div className="text-lg font-medium mb-4 flex flex-col items-center">
                  <span>
                    You are attempting to lock <strong>2 BTC</strong> and mint
                  </span>
                  <span>
                    <strong>65,00 USDB</strong>. This is a simulation.
                  </span>
                </div>
                <button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg shadow"
                  onClick={() => setShowSuccessModal(false)}
                >
                  View Progress
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function createParticle(width: number, height: number, color: string) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    sz: Math.random() * 1.5 + 0.5,
    sx: Math.random() * 0.5 - 0.25,
    sy: Math.random() * 0.5 - 0.25,
    color,
  };
}

export default USDBCoin;
