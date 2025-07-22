// components/SuccessModal.tsx
type SuccessModalProps = {
  show: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
};

const SuccessModal = ({ show, onClose, theme }: SuccessModalProps) => {
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ${
        theme === 'light' ? 'bg-white/80' : 'bg-black/80'
      }`}
    >
      <div
        className="p-8 app-card rounded-xl text-center shadow-lg w-full max-w-3xl h-[340px] mx-4 flex flex-col items-center justify-center"
        style={{ backgroundColor: 'var(--bg-color)' }}
      >
        <div>
          <h2 className="text-2xl font-medium mb-2">
            Minting transaction submitted!
          </h2>
          <div className="text-lg font-medium mb-4 flex flex-col items-center">
            <span>
              You are attempting to lock <strong>2 BTC</strong> and mint
            </span>
            <span>
              <strong>6,500 USDB</strong>. This is a simulation.
            </span>
          </div>
          <button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg shadow"
            onClick={onClose}
          >
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
