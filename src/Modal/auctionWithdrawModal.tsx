import type { AuctionWithdrawModalProps } from "../types/auctionWithDrawModal";

const AuctionWithdrawModal = ({
  show,
  onClose,
  handleWithdrawPsbt,
  vaults
}: AuctionWithdrawModalProps) => {
  console.log("mintData", vaults);
  if (!show) return null;

  const vault = vaults?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 modal-background">
      <div className="relative w-full max-w-xl mx-4 rounded-xl shadow-lg p-8 flex flex-col gap-6 modal-card">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-center text-muted">
          You're about to sign a transaction
        </h2>

        <div className="text-muted text-base space-y-4">
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <span className="font-bold">Burning:</span>
            <span>
              10 USDBZ tokens will be burnt from your wallet
            </span>
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-2">
            <span className="font-bold">You Receive:</span>
            <div>
              <p>
                {vault?.currentClaimPrice?.amount} vault BTC 
              </p>
            </div>
          </div>
        </div>

        <button
          className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg shadow"
          onClick={handleWithdrawPsbt}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default AuctionWithdrawModal;
