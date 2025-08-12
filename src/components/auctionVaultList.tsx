import { AuctionVaultCard } from "./auctionVaultCard"


interface AuctionVault {
  id: string
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
}

interface AuctionVaultListProps {
  vaults: AuctionVault[]
  onClaim: (vaultId: string) => void
}

export function AuctionVaultList({ vaults, onClaim }: AuctionVaultListProps) {
  return (
    <div className="space-y-6 mt-5">
      {vaults.map((vault) => (
        <AuctionVaultCard
          key={vault.id}
          vaultId={vault.vaultId}
          liquidationStarted={vault.liquidationStarted}
          timeLeft={vault.timeLeft}
          txId={vault.txId}
          vaultCollateral={vault.vaultCollateral}
          lot={vault.lot}
          currentClaimPrice={vault.currentClaimPrice}
          onClaim={() => onClaim(vault.id)}
        />
      ))}
    </div>
  )
}
