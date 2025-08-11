export interface MintPanelProps {
  mintAmount: number;
  collateralRatio: number;
  liquidationPrice: string;
  requiredCollateralBTC: string;
  btcPrice: number | null;
  feeRequiredToMint: number;
  Error:string
}
