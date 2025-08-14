import { Check, Copy, X } from "lucide-react";
import { useState } from "react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  handleCloseModal: () => void; 
}

export function TransactionModal({
  isOpen,
  onClose,
  transactionId,
  handleCloseModal
}: TransactionModalProps) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="relative rounded-2xl max-w-md w-full mx-4 text-center"
        style={{ backgroundColor: "#111111" }}
      >
        {/* Mac-style title bar */}
        <div
          className="w-full flex items-center gap-2 px-4 py-2 rounded-t-2xl"
          style={{ backgroundColor: "#3B3B3B" }} // Dark gray Mac-style title bar
        >
          <button
            onClick={onClose}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#FF5F57" }}
            aria-label="Close"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {hovered && <X className="w-2 h-2 text-black" strokeWidth={3} />}
          </button>
          {/* Title centered */}
          <div className="flex-1 text-center text-gray-200 text-sm font-medium">
            Xverse Wallet
          </div>
        </div>
<div className="pb-8 px-8">
        {/* Network Label */}
        <div
          style={{ color: "#9CA3AF" }}
          className="text-sm font-medium mb-8 mt-4"
        >
          Testnet
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ border: "2px solid #10B981" }}
          >
            <Check
              className="w-8 h-8"
              style={{ color: "#10B981" }}
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-[22px] font-bold mb-2">
          Transaction broadcast
        </h2>

        {/* Description */}
        <p style={{ color: "#9CA3AF" }} className="text-base mb-6">
          Your transaction has been successfully submitted.
        </p>

        {/* Explorer Link */}
        <div style={{ color: "#D1D5DB" }} className="text-sm mb-8">
          See on{" "}
          <a
            href={`https://mempool.space/testnet4/tx/${transactionId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-medium hover:underline"
          >
            Explorer
          </a>
        </div>

        {/* Transaction ID Section */}
        <div className="mb-8 text-left">
          <div
            style={{ color: "#9CA3AF" }}
            className="text-xs font-medium uppercase tracking-wider mb-2"
          >
            Transaction ID
          </div>
          <div
            className="rounded-lg p-4 flex items-center justify-between"
            style={{ backgroundColor: "#1A1A1A" }}
          >
            <div className="text-white text-sm font-mono break-all mr-3">
              {transactionId}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              style={{ color: copied ? "#10B981" : "#9CA3AF" }}
              className="hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="w-full font-medium py-3 rounded-xl"
          style={{
            backgroundColor: "#FFFFFF",
            color: "#000000",
          }}
        >
          Close
        </button>
        </div>
      </div>
    </div>
  );
}
