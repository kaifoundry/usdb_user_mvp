import type { TabsProps } from "../interfaces/components/tabPropsInterface";

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div
      className="flex border-b"
      style={{ borderColor: "var(--card-border-color)" }}
    >
      <button
        onClick={() => onTabChange("mint")}
        className={`tab flex-1 py-3 text-base font-medium ${
          activeTab === "mint" ? "active" : ""
        }`}
      >
        Mint
      </button>
      <button
        onClick={() => onTabChange("withdraw")}
        className={`tab flex-1 py-3 text-base font-medium ${
          activeTab === "withdraw" ? "active" : ""
        }`}
      >
        Withdraw
      </button>
    </div>
  );
};

export default Tabs;
