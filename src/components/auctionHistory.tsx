import { ExternalLink } from "lucide-react"

export interface HistoricalVault {
  id: string
  vaultId: string
  date: string
  btcCollateral: string
  finalBid: string
  walletAddress: string
}
interface HistoricalVaultsTableProps {
  vaults: HistoricalVault[]
}

export function AuctionHistoryVault({ vaults }: HistoricalVaultsTableProps) {
  const truncateAddress = (address: string) => {
    if (address.length <= 12) return address
    return `${address.slice(0, 4)}...${address.slice(-5)}`
  }

  return (
    <div className="w-full text-xs mt-5">
      <div className="overflow-x-auto">
        <table className="w-full border border-[rgba(255, 255, 255, 0.1)] border-collapse rounded-b-md">
          <thead className="bg-[#131313]">
            <tr>
              <th className="text-left py-2 px-3 text-gray-300 font-medium whitespace-nowrap">Vault ID</th>
              <th className="text-left py-2 px-3 text-gray-300 font-medium whitespace-nowrap">Date</th>
              <th className="text-left py-2 px-3 text-gray-300 font-medium whitespace-nowrap">BTC Collateral</th>
              <th className="text-left py-2 px-3 text-gray-300 font-medium whitespace-nowrap">Final Bid</th>
              <th className="text-left py-2 px-3 text-gray-300 font-medium whitespace-nowrap">Wallet Address</th>
            </tr>
          </thead>
          <tbody>
            {vaults.map((vault) => (
              <tr
                key={vault.id}
                className="border-t border-gray-700 hover:bg-gray-900/50 transition-colors"
              >
                <td className="py-2 px-3 text-white font-medium">{vault.vaultId}</td>
                <td className="py-2 px-3 text-white">{vault.date}</td>
                <td className="py-2 px-3 text-white">{vault.btcCollateral}</td>
                <td className="py-2 px-3 text-white">{vault.finalBid}</td>
                <td className="py-2 px-3 text-white">
                  <div className="flex items-center gap-1.5">
                    <span>{truncateAddress(vault.walletAddress)}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
