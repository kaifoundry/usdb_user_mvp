import type { MintPanelProps } from "../interfaces/components/mintPanelPropsInterface";

export default function MintPanel({
  mintAmount,
  collateralRatio,
  liquidationPrice,
  requiredCollateralBTC,
  btcPrice,
  
}: MintPanelProps) {
  return (
    <>
      <div className="rounded-lg p-6 mt-6 app-input border border-gray-700">
        <div className="text-sm text-muted mb-2">Collateral Required</div>
        <div className="flex items-center justify-between text-2xl font-medium">
          <span>{requiredCollateralBTC}</span>
          <span className="text-muted font-normal text-base ml-4">BTC</span>
        </div>
      </div>

      <div className="rounded-lg p-6 mt-4 app-input border border-gray-700">
        <div className="text-sm text-muted mb-2">Tokens received per mint</div>
        <div className="flex items-center justify-between text-2xl font-medium">
          <span>{mintAmount}</span>
          <span className="text-muted font-normal text-base ml-4">USDBZ</span>
        </div>
      </div>

      <div className="text-sm text-muted space-y-3 mt-6">
        <div className="flex justify-between">
          <span>BTC Price</span>
          <div className="flex items-center">
          <span>$ {btcPrice}</span>
      <span className="relative flex h-2.5 w-2.5 ml-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
      </span>
      </div>
        </div>
        <div className="flex justify-between">
          <span>Collateral Ratio</span>
          <span>{collateralRatio}%</span>
        </div>
        <div className="flex justify-between">
          <span>Fee required to mint</span>
          <span>0.00005 BTC</span>
        </div>
        <div className="flex justify-between">
          <span>Liquidation Price</span>
          <span>~ {liquidationPrice}</span>
        </div>
      </div>

      <div className="mt-4 text-xs px-2 py-1 rounded w-fit text-[#f7e926da] border border-[#F7E9261F] bg-[#F7E9261F]">
        Min Balance required is {requiredCollateralBTC !== "--" ? `${(parseFloat(requiredCollateralBTC) + 0.00005).toFixed(8)} BTC` : "--"}
      </div>
    </>
  );
}
