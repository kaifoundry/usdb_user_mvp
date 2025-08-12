import { ExternalLink } from "lucide-react"

interface AuctionVaultCardProps {
  vaultId: string
  liquidationStarted: string
  timeLeft: string
  txId: string
  vaultCollateral: {
    amount: string
    currency: string
  }
  lot: {
    amount: string
    currency: string
  }
  currentClaimPrice: {
    amount: string
    unit: string
    currency: string
  }
  onClaim: () => void
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
  const truncatedTxId = `${txId.slice(0, 5)}...${txId.slice(-4)}`

  return (
    <div className="app-card border border-gray-700 rounded-lg p-6 space-y-4 text-sm">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white text-base font-medium">
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
            <span className="text-white text-sm">{truncatedTxId}</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Vault Collateral</span>
          <span className="text-white text-sm">
            {vaultCollateral.amount}{" "}
            <span className="font-medium">{vaultCollateral.currency}</span>
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Lot</span>
          <span className="text-white text-sm">
            {lot.amount}{" "}
            <span className="font-medium">{lot.currency}</span>
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Current Claim Price</span>
          <span className="text-white text-sm">
            {currentClaimPrice.amount} {currentClaimPrice.unit}{" "}
            {currentClaimPrice.currency}
          </span>
        </div>
      </div>

      {/* Claim Button */}
      <button
        onClick={onClaim}
        className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
      >
        Claim
      </button>
    </div>
  )
}
