import { ExternalLink } from "lucide-react"
import { useFormattedDate } from "../Hooks/useTimeAgo"

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
    return `${address.slice(0, 4)}....${address.slice(-4)}`
  }

  return (
    <div className="w-full  text-xs mt-5 border border-[rgba(255,255,255,0.15)] rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-[rgba(255,255,255,0.15)] rounded-2xl overflow-hidden">
          <thead className="bg-[#1A1A1A]">
            <tr>
              <th className="text-left py-2 px-3 text-[rgba(255,255,255,0.7)] font-medium whitespace-nowrap">
                Vault ID
              </th>
              <th className="text-left py-2 px-3 text-[rgba(255,255,255,0.7)] font-medium whitespace-nowrap">
                Date
              </th>
              <th className="text-left py-2 px-3 text-[rgba(255,255,255,0.7)] font-medium whitespace-nowrap">
                BTC Collateral
              </th>
              <th className="text-left py-2 px-3 text-[rgba(255,255,255,0.7)] font-medium whitespace-nowrap">
                Final Bid
              </th>
              <th className="text-left py-2 px-3 text-[rgba(255,255,255,0.7)] font-medium whitespace-nowrap">
                Wallet Address
              </th>
            </tr>
          </thead>
          <tbody>
            {vaults.map((vault, idx) => (
              <tr
                key={vault.id}
                className={`${
                  idx !== 0 ? "border-t border-[rgba(255,255,255,0.1)]" : ""
                } hover:bg-[#1a1a1a] transition-colors`}
              >
                <td className="py-2 px-3 text-white font-medium"># {vault.vaultId}</td>
                <td className="py-2 px-3 text-white">{useFormattedDate(vault.date)}</td>
                <td className="py-2 px-3 text-white">{vault.btcCollateral}</td>
                <td className="py-2 px-3 text-white">{vault.finalBid}</td>
                <td className="py-2 px-3 text-white">
                  <div className="flex items-center gap-1.5">
                    <span>{truncateAddress(vault.walletAddress)}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400 hover:text-white transition-colors cursor-pointer" />
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
