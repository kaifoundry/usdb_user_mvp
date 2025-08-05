import type { CombinedTransactionStatus } from "../../types/transactionApiResponse";
import type { RuneBalance } from "../api/getRunesBalanceInterface";

export interface WithDrawPanelProps {
  vaults: RuneBalance[];
  selectedVaults: string[];
  toggleVault: (id: string) => void;
  toggleSelectAll: () => void;
  allSelected: boolean;
  totalDebt: number;
  totalCollateral: number;
  handleWithdraw: () => void;
  transactionStatus: CombinedTransactionStatus | null;
  txIds: string[] | undefined;
}