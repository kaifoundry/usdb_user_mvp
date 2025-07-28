type OutputData = Array<{
  address: string;
  amount: string;
}>;


type MintModalProps = {
  show: boolean;
  onClose: () => void;
  outputs?: OutputData;
  handlePsbt: () => void;
};

const MintModal = ({ show, onClose, outputs ,handlePsbt}: MintModalProps) => {
  

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300  modal-background">
      <div className="relative w-full max-w-2xl mx-4 rounded-xl shadow-lg p-8 flex flex-col gap-6 modal-card ">
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold text-center">
          Minting transaction submitted
        </h2>
        {outputs ? (
          outputs.map((output,index) => (
          <div className="w-full text-left text-base" key={index}>
            <div className="mb-4">
              <p className="text-gray-500">Address {index+1}:</p>
              <p className="font-mono text-sm break-all">{output.address}</p>
              <p className="mt-2 text-gray-500">Amount:</p>
              <p className="font-bold">{output.amount}</p>
            </div>

            <hr className="my-4 border-t border-gray-300 dark:border-gray-700" />
          </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Loading transaction details...</p>
        )}
        <button
          className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg shadow"
          onClick={handlePsbt}
        >
          Sign Psbt
        </button>
      </div>
    </div>
  );
};

export default MintModal;
