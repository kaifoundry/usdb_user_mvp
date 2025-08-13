import type { VaultTransaction } from "../interfaces/pages/getTransactionInterface";

export type WithdrawModalProps = {
  show: boolean;
  onClose: () => void;
  handleWithdrawPsbt: () => void;
    vaults: VaultTransaction[];
  
};