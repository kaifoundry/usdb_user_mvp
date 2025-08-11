import type { MintPanelProps } from "../interfaces/components/mintPanelPropsInterface";
import balanceError from "/assets/balanceError.svg";
import type { Theme } from "../types/theme";
import { useWallet } from "../api/connectWallet";

export default function MintPanel({
  mintAmount,
  collateralRatio,
  liquidationPrice,
  requiredCollateralBTC,
  btcPrice,
  feeRequiredToMint,
  Error,
}: MintPanelProps) {
  const theme: Theme =
    localStorage.getItem("theme") === "light" ||
    localStorage.getItem("theme") === "dark"
      ? (localStorage.getItem("theme") as Theme)
      : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  const { wallet } = useWallet();
  const displayValue = (val: any, unit = "") => {
    if (!wallet) return `0${unit}`;
    if (val === null || val === undefined || val === "--") return `0${unit}`;
    return `${val}${unit}`;
  };

  return (
    <>
      <div className="rounded-lg p-6 mt-6 app-input border border-gray-700">
        <div className="text-sm text-muted mb-2">Collateral Required</div>
        <div className="flex items-center justify-between text-2xl font-medium">
          <span className={`${Error ? "text-red-500 flex items-center" : ""}`}>
            {Error && (
              <img
                src={balanceError}
                alt="balanceError"
                className={`size-4 mr-2`}
                title={Error}
              />
            )}
            {displayValue(requiredCollateralBTC)}
          </span>
          <span className="text-muted font-normal text-base ml-4">BTC</span>
        </div>
      </div>

      <div className="rounded-lg p-6 mt-4 app-input border border-gray-700">
        <div className="text-sm text-muted mb-2">Tokens received per mint</div>
        <div className="flex items-center justify-between text-2xl font-medium">
          <span>{displayValue(mintAmount)}</span>
          <span className="text-muted font-normal text-base ml-4">USDBZ</span>
        </div>
      </div>
      <div className="text-sm text-muted space-y-3 mt-6">
        <div className="flex justify-between">
          <span>BTC Price</span>
          <div className="flex items-center">
            <span>$ {displayValue(btcPrice)}</span>
            <span className="relative flex h-2.5 w-2.5 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>Collateral Ratio</span>
          <span>{displayValue(collateralRatio, "%")}</span>
        </div>
        <div className="flex justify-between">
          <span>Fee required to mint</span>
          <span>{displayValue(feeRequiredToMint, " BTC")}</span>
        </div>
        <div className="flex justify-between">
          <span>Liquidation Price</span>
          <span>~ {displayValue(liquidationPrice)}</span>
        </div>
      </div>
      <div
        className="mt-4 text-xs px-2 py-1 rounded-lg w-full flex items-center gap-2"
        style={{
          backgroundColor: Error
            ? theme === "dark"
              ? "#E8404014"
              : "#E840401F"
            : theme === "dark"
            ? "#F7E92614"
            : "#F7E9263D",
          border: Error
            ? "1px solid rgba(232, 64, 64, 0.6)"
            : "1px solid #F7E926",
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: Error ? "#E84040" : "#F7E926",
          }}
        ></span>
        <span className={Error ? "text-red-500" : ""}>
          Min Balance required is{" "}
          {wallet && requiredCollateralBTC !== "--"
            ? `${(
                parseFloat(requiredCollateralBTC) + feeRequiredToMint
              ).toFixed(8)} BTC`
            : "0 BTC"}
        </span>
      </div>
    </>
  );
}
