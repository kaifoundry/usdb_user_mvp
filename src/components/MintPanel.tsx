import useBTCConverter from "../Hooks/useBTCConverter";
import type { MintPanelProps } from "../interfaces/components/mintPanelInterface";
export default function MintPanel({
  btcDeposit,
  error,
  getBalanceResult,
  mintAmount,
  collateralRatio,
  liquidationPrice,
  requiredCollateralBTC,
  requiredCollateralSATs,
  handleBtcDeposit,
}: MintPanelProps) {
  const { satsToBtc } = useBTCConverter();

  return (

        <>
        <div className="rounded-lg p-6 mt-6 app-input">
          <div className="flex items-center">
            <input
              type="number"
              value={btcDeposit}
              onChange={(e) => handleBtcDeposit(e.target.value)}
              placeholder="Deposit BTC"
              readOnly
              className={`flex-1 bg-transparent text-xl placeholder-gray-400 focus:outline-none font-normal ${
                error ? "text-red-500" : ""
              }`}
            />
            <span className="text-muted font-medium ml-4">BTC</span>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-red-500 mt-3">{error}</div>
            <div
              className={`text-sm mt-3 ${
                error ? "text-red-500" : "text-gray-500"
              }`}
            >
              Balance:{" "}
              {getBalanceResult !== null
                ? `${satsToBtc(Number(getBalanceResult))} BTC`
                : "--"}
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 w-[62px] h-[54px] app-card rounded-[12px] flex items-center justify-center shadow-md z-10 gap-2.5 opacity-100">
            <span className="text-lg ">↓</span>
          </div>
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 mt-2 app-input app-input-readonly">
            <div className="flex items-center relative ">
              <input
                type="number"
                value={mintAmount}
                readOnly
                className="flex-1 bg-transparent w-full  pr-20 rounded-lg text-2xl focus:outline-none focus:ring-0 focus:border-transparent"
              />
              {!mintAmount && (
                <div className="absolute left-0 pointer-events-none flex-1">
                  <span className="text-xl text-gray-400 font-normal">
                    Mint USDB
                  </span>
                  <span className="text-sm text-gray-400 ml-2">
                    (in multiples of 100)
                  </span>
                </div>
              )}
              <span className="text-muted font-medium ml-4">USDB</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted space-y-2 mt-6">
          <div className="flex justify-between">
            <span>BTC Price</span>
            <span>$</span>
          </div>
          <div className="flex justify-between">
            <span>Collateral Ratio</span>
            <span>{collateralRatio}%</span>
          </div>
          <div className="flex justify-between">
            <span>Liquidation Price</span>
            <span>{liquidationPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Required Collateral</span>
            <span>
              {requiredCollateralBTC} BTC ≈ {requiredCollateralSATs} SATs
            </span>
          </div>
        </div>
</>
        
  );
}
