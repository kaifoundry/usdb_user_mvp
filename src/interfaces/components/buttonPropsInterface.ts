import type { TabType } from "../../types/tab";
import type { ConnectWalletResult } from "../api/connectWalletInterface";

export interface ButtonProps {
  activeTab: TabType;
  loading: boolean;
  handleMint: () => void;
  handleWithdraw: () => void;
  connectWallet:() =>void;
  wallet:ConnectWalletResult|null;
  Error:string;
}