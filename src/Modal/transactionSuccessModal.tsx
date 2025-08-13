import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transactionId: string
}

export function TransactionModal({ isOpen, onClose, transactionId }: TransactionModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transactionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* Header */}
        <div className="text-gray-400 text-sm font-medium mb-8">Testnet</div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-500" strokeWidth={3} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold mb-3">Transaction broadcast</h2>

        {/* Description */}
        <p className="text-gray-400 text-base mb-6">Your transaction has been successfully submitted.</p>

        {/* Explorer Link */}
        <div className="text-gray-300 text-sm mb-8">
          See on <span className="text-white font-medium">Explorer</span>
        </div>

        {/* Transaction ID Section */}
        <div className="mb-8">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 text-left">
            Transaction ID
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
            <div className="text-white text-sm font-mono break-all mr-3 leading-relaxed">{transactionId}5</div>
            <button
            type="button"
              onClick={handleCopy}
              className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 h-auto min-w-0"
            >
              {/* <Copy className={cn("w-4 h-4", copied && "text-green-500")} /> */}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-xl">
          Close
        </button>
      </div>
    </div>
  )
}
