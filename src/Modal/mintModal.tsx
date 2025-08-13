import { FEE_REQUIRED_TO_MINT, MINT_AMOUNT } from "../constants/appContsants";
import type { MintData } from "../types/mintApiResponse";

type MintModalProps = {
  show: boolean;
  onClose: () => void;
  outputs?: MintData | null;
  handlePsbt: () => void;
};

const MintModal = ({ show, onClose, outputs, handlePsbt }: MintModalProps) => {
  console.log('outputs',outputs)
  if (!show) return null;

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
    <span className="font-bold">Fee:</span>
    <span>{FEE_REQUIRED_TO_MINT} BTC will be sent to protocol from your wallet as fee</span>
  </div>
  <div className="grid grid-cols-[120px_1fr] gap-2">
    <span className="font-bold">Vault Lock:</span>
    <div>
      <p>{outputs?.data?.collateralRequired} BTC will be locked into a secure vault with address</p>
      <a
  href={`https://mempool.space/testnet4/address/${outputs?.data?.vaultAddress}`}
  target="_blank"
  rel="noopener noreferrer"
  className="underline hover:text-blue-500"
>
  Learn More
</a>
    </div>
  </div>
  <div className="grid grid-cols-[120px_1fr] gap-2">
    <span className="font-bold">You Receive:</span>
    <span>{MINT_AMOUNT} USDBZ tokens</span>
  </div>
</div>


        <button
          className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg shadow"
          onClick={handlePsbt}
        >
          Sign PSBT
        </button>
      </div>
    </div>
  );
};

export default MintModal;
