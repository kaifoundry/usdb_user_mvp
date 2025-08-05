export interface MintPanelProps {
  btcDeposit: string;
  error: string;
  getBalanceResult: string | null;
  mintAmount: number;
  collateralRatio: string;
  liquidationPrice: string;
  requiredCollateralBTC: string;
  requiredCollateralSATs: string;
  handleBtcDeposit: (v: string) => void;
}