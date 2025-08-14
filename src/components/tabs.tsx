import type { TabsProps } from "../interfaces/components/tabPropsInterface";

const Tabs: React.FC<TabsProps> = ({
  activeTab,
  onTabChange,
  setShowAuctionTabs,
  showAuctionTabs,
  activeAuctionTab,
  setActiveAuctionTab,
}) => {
  return (
    <div>
      {!showAuctionTabs && (
        <div
          className="flex border-b"
          style={{ borderColor: "var(--card-border-color)" }}
        >
          <button
            onClick={() => {
              onTabChange("mint");
              setShowAuctionTabs(false);
            }}
            className={`tab flex-1 py-3 text-base font-medium ${
              activeTab === "mint" ? "active" : ""
            }`}
          >
            Mint
          </button>
          <button
            onClick={() => {
              onTabChange("withdraw");
              setShowAuctionTabs(false);
            }}
            className={`tab flex-1 py-3 text-base font-medium ${
              activeTab === "withdraw" ? "active" : ""
            }`}
          >
            Withdraw
          </button>
        </div>
      )}
      {showAuctionTabs && (
        <div
          className="flex border-b mt-2"
          style={{ borderColor: "var(--card-border-color)" }}
        >
          <button
            onClick={() => setActiveAuctionTab("live")}
            className={`tab flex-1 py-3 text-base font-medium ${
              activeAuctionTab === "live" ? "active" : ""
            }`}
          >
            Live Auction
          </button>
          <button
            onClick={() => setActiveAuctionTab("past")}
            className={`tab flex-1 py-3 text-base font-medium ${
              activeAuctionTab === "past" ? "active" : ""
            }`}
          >
            Past Auction
          </button>
        </div>
      )}
    </div>
  );
};

export default Tabs;
