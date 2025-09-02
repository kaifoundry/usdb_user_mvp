import type { AuctionVault } from "../interfaces/pages/auctionInterface";

export type AuctionWithdrawModalProps = {
  show: boolean;
  onClose: () => void;
  handleWithdrawPsbt: () => void;
    vaults: AuctionVault[];
  
};