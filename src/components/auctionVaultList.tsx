import { useAuctionTimer } from "../Hooks/useTimeAgo"
import type { AuctionVault } from "../interfaces/pages/auctionInterface"
import { AuctionVaultCard } from "./auctionVaultCard"

export function AuctionVaultList({
  vaults,
  onClaim,
}: {
  vaults: AuctionVault[]
  onClaim: (vault: AuctionVault) => void  
}) {
  return (
    <div className="space-y-6 mt-5">
      {vaults.map((vault) => (
        <AuctionVaultCardWrapper
          key={vault.id}
          vault={vault}
          onClaim={onClaim}
        />
      ))}
    </div>
  )
}

function AuctionVaultCardWrapper({
  vault,
  onClaim,
}: {
  vault: AuctionVault
  onClaim: (vault: AuctionVault) => void
}) {
  const timeLeft = useAuctionTimer(vault.auctionStartTs, 30)

  return (
    <AuctionVaultCard
      vaultId={vault.vaultId}
      liquidationStarted={vault.liquidationStarted}
      timeLeft={timeLeft}
      txId={vault.txId}
      vaultCollateral={vault.vaultCollateral}
      lot={vault.lot}
      currentClaimPrice={vault.currentClaimPrice}
      onClaim={() => onClaim(vault)}  
    />
  )
}
