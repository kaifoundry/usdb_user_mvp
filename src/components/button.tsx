import type { ButtonProps } from "../interfaces/components/buttonPropsInterface";

export const Button: React.FC<ButtonProps> = ({
  activeTab,
  loading,
  handleMint,
  handleWithdraw,
  connectWallet,
  wallet,
  Error
}) => {
  const isWalletConnected = Boolean(wallet?.paymentAddress);
  const hasError = Boolean(Error);

  const handleClick = hasError
    ? undefined 
    : !isWalletConnected
    ? connectWallet
    : activeTab === "mint"
    ? handleMint
    : handleWithdraw;

  const label = hasError
  ? String(Error) 
  : loading
  ? "Processing..."
  : !isWalletConnected
  ? "Connect Wallet"
  : activeTab === "mint"
  ? "Mint USDB"
  : "Withdraw Selected";


const buttonClass = `w-full mt-6 transition-colors duration-500 ease-in-out ${
  hasError
    ? "bg-[#F8A744] text-gray-500 cursor-not-allowed"
    : loading
    ? "bg-gray-400 text-black cursor-not-allowed"
    : "bg-amber-500 hover:bg-amber-600 text-black"
} font-bold py-4 rounded-lg text-lg`;


  return (
    <button
      onClick={handleClick}
      disabled={loading || hasError}
      className={buttonClass}
    >
      {label}
    </button>
  );
};
