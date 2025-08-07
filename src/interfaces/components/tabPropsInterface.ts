import type { TabType } from "../../types/tab";

export interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}