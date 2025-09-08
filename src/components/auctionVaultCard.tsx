import { ExternalLink } from "lucide-react";

interface AuctionVaultCardProps {
  vaultId: string;
  liquidationStarted: string;
  timeLeft: string;
  txId: string;
  vaultCollateral: {
    amount: number;
    currency: string;
  };
  lot: {
    amount: number;
    currency: string;
  };
  currentClaimPrice: {
    amount: number;
    unit: string;
    currency: string;
  };
  onClaim: () => void;
}

export function AuctionVaultCard({
  vaultId,
  liquidationStarted,
  timeLeft,
  txId,
  vaultCollateral,
  lot,
  currentClaimPrice,
  onClaim,
}: AuctionVaultCardProps) {
  const truncatedTxId = `${txId.slice(0, 5)}...${txId.slice(-4)}`;

  return (
    <div className="app-card border border-gray-700 rounded-lg p-6 space-y-4 text-sm">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className=" text-base font-medium">
            Vault ID {vaultId}
          </h3>
          <p className="text-gray-400 text-xs">
            Liquidation started: {liquidationStarted}
          </p>
        </div>
        <div className="bg-gray-800 px-3 py-1 rounded-md">
          <span className="text-gray-300 text-xs">{timeLeft}</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Tx ID</span>
          <div className="flex items-center gap-2">
            <span className="text-sm">{truncatedTxId}</span>
            <a href={`https://mempool.space/testnet4/tx/${txId}`}>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Vault Collateral</span>
          <span className="text-sm">
            {vaultCollateral.amount}{" "}
            <span className="font-medium">{vaultCollateral.currency}</span>
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Lot</span>
          <span className="text-sm">
            {lot.amount} <span className="font-medium">{lot.currency}</span>
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Current Claim Price</span>
          <span className="text-sm">
            {currentClaimPrice.amount} {currentClaimPrice.unit}{" "}
            {currentClaimPrice.currency}
          </span>
        </div>
      </div>

      {/* Claim Button */}
      <button
        onClick={onClaim}
        disabled={timeLeft === "Expired"}
        className={`w-full font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm 
    ${
      timeLeft === "Expired"
        ? "bg-gray-400 text-gray-200 cursor-not-allowed opacity-60"
        : "bg-orange-400 hover:bg-orange-500 text-white"
    }`}
      >
        Claim
      </button>
    </div>
  );
}
