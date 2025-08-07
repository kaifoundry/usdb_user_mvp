
import type { VaultTransaction } from "../pages/getTransactionInterface";

export interface WithDrawPanelProps {
  vaults: VaultTransaction[];
  selectedVaults: string[];
  toggleVault: (id: string) => void;
  toggleSelectAll: () => void;
  allSelected: boolean;
  totalDebt: number;
  totalCollateral: number;
}