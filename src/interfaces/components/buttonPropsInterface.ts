import type { TabType } from "../../types/tab";

export interface ButtonProps {
  activeTab: TabType;
  loading: boolean;
  handleMint: () => void;
  handleWithdraw: () => void;
}