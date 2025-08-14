import type { AuctionTabType, TabType } from "../../types/tab";
import type { Dispatch, SetStateAction } from "react";

export interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  showAuctionTabs: boolean;
  setShowAuctionTabs: Dispatch<SetStateAction<boolean>>;
  activeAuctionTab: AuctionTabType;
  setActiveAuctionTab: Dispatch<SetStateAction<AuctionTabType>>;
}
