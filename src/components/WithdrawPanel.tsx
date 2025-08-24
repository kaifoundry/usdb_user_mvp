import { useWallet } from "../api/connectWallet";
import type { WithDrawPanelProps } from "../interfaces/components/withDrawPanelpropsInterface";
import type { Theme } from "../types/theme";
import { VaultCard } from "./vaultCard";

export default function WithdrawPanel({
  vaults,
  selectedVaults,
  toggleVault,
  totalDebt,
  totalCollateral,
}: WithDrawPanelProps) {

  const theme: Theme =
    localStorage.getItem("theme") === "light" ||
    localStorage.getItem("theme") === "dark"
      ? (localStorage.getItem("theme") as Theme)
      : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";

  const { wallet } = useWallet();

  if (!wallet) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-6 rounded-lg">
          <p className="text-lg font-semibold mb-2">Wallet Not Connected</p>
          <p className="text-sm opacity-80 mb-4 text-center">
            Please connect your wallet to view and manage your vaults.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      {/* {vaults.some(v => v.status === "confirmed") && (
      <div className="flex items-center justify-between mt-6">
        <label
          className={`text-sm ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Select vaults to close
        </label>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            Select All
          </span>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="w-4 h-4 vault-checkbox"
          />
        </div>
      </div>
      )} */}

      {/* Vault list */}
      <div className="mt-2 space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
        {vaults
    ?.filter((vault) => vault?.id !== undefined)
    .map((vault) => (
      <VaultCard
        key={vault.id}
        vault={vault}
        theme={theme}
        isSelected={selectedVaults.includes(vault.id.toString())}
        toggleVault={toggleVault}
      />
    ))}
      </div>

      {/* Summary */}
      <div
        className={`mt-6 pt-4 border-t ${
          theme === "light" ? "border-gray-200" : "border-gray-700"
        }`}
      >
        <div
          className={`text-lg font-semibold mb-4 ${
            theme === "light" ? "text-gray-900" : "text-gray-100"
          }`}
        >
          Summary
        </div>
        <div
          className={`text-sm space-y-2 ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          <div className="flex justify-between">
            <span>Total to Repay</span>
            <span>${totalDebt?.toFixed(2) ?? "0.00"}</span>
          </div>
          <div className="flex justify-between">
            <span>Collateral to Withdraw</span>
            <span>{totalCollateral?.toFixed(6) ?? "0.000000"} BTC</span>
          </div>
        </div>
      </div>
    </>
  );
}
