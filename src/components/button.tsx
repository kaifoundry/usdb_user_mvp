import type { ButtonProps } from "../interfaces/components/buttonPropsInterface";


export const Button: React.FC<ButtonProps> = ({
  activeTab,
  loading,
  handleMint,
  handleWithdraw,
}) => {
  const handleClick = activeTab === "mint" ? handleMint : handleWithdraw;
  const label = loading
    ? "Processing..."
    : activeTab === "mint"
    ? "Mint USDB"
    : "Withdraw Selected";

  const buttonClass = `w-full mt-6 ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-amber-500 hover:bg-amber-600"
  } text-black font-bold py-4 rounded-lg text-lg`;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={buttonClass}
    >
      {label}
    </button>
  );
};
