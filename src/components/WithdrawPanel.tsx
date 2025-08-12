import { useWallet } from "../api/connectWallet";
import { useTimeAgo } from "../Hooks/useTimeAgo";
import type { WithDrawPanelProps } from "../interfaces/components/withDrawPanelpropsInterface";
import type { Theme } from "../types/theme";

export default function WithdrawPanel({
  vaults,
  selectedVaults,
  toggleVault,
  toggleSelectAll,
  allSelected,
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

      {/* Vault list */}
      <div className="mt-2 space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
        {vaults &&
          vaults
            .filter((vault) => vault?.id !== undefined)
            .map((vault) => {
              const vaultId = vault?.id?.toString();
              const vaultStatus = vault?.status;
              const isSelected = selectedVaults?.includes(vaultId);
              const confirmedAt = vault?.confirmed_at
                ? useTimeAgo(vault?.confirmed_at)
                : "Not confirmed yet..";
              const txId = vault?.tx_id ?? "7345e...9008";
              const usdbAmount = vault?.usdb_amount ?? 0;
              const collateralRequired = vault?.collateral_required ?? 0.00008;
              const collateralRatio = vault?.collateral_ratio
                ? Math.round(vault.collateral_ratio)
                : 0;
              const statusLabel =
                vaultStatus === "confirmed"
                  ? "Confirmed"
                  : vaultStatus === "in_progress"
                  ? "In Progress"
                  : "Pending";

              const statusColor =
                vaultStatus === "confirmed"
                  ? theme === "light"
                    ? "bg-[#40bf00]/10 text-green-500 border border-green-500"
                    : "bg-[#40bf00]/10 text-[#dbdbdb] border border-green-500"
                  : theme === "light"
                  ? "bg-[#F7E926]/10 text-yellow-500 border border-yellow-500"
                  : "bg-[#F7E926]/10 text-[#dbdbdb] border border-[#F7E926]/12";

              const lockColor =
                vaultStatus === "confirmed"
                  ? "text-green-500"
                  : "text-yellow-500";

              let ratioLabel = "";
              let ratioColor = "";
              if (collateralRatio >= 200) {
                ratioLabel = "Healthy";
                ratioColor =
                  theme === "light"
                    ? "bg-[#40bf00]/10 text-green-500 border border-green-500"
                    : "bg-[#40bf00]/10 text-[#dbdbdb] border border-[#40bf00]/12";
              } else if (collateralRatio >= 150) {
                ratioLabel = "At Risk";
                ratioColor =
                  theme === "light"
                    ? "bg-[#F7E926]/10 text-yellow-500 border border-yellow-500"
                    : "bg-[rgba(247,233,38,0.08)] text-[#dbdbdb] border border-[rgba(247,233,38,0.12)]";
              } else {
                ratioLabel = "under liquidation auction";
                ratioColor =
                  theme === "light"
                    ? "bg-[rgba(232,64,64,0.08)] text-red-500 border border-red-500"
                    : "bg-[rgba(232,64,64,0.08)] text-[#dbdbdb] border border-[rgba(232,64,64,0.12)]";
              }

              const borderStyle =
                vaultStatus === "in_progress" || vaultStatus === "pending"
                  ? "border-2 border-dashed border-[#5E582F]"
                  : isSelected
                  ? "border-green-500"
                  : theme === "light"
                  ? "border-gray-300"
                  : "border-gray-700";

              return (
                <div
                  key={vaultId}
                  className={`vault-item p-4 rounded-lg app-card ${borderStyle} ${
                    theme === "light" ? "bg-white" : "bg-gray-800"
                  }`}
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center justify-between">
                      <div className="pt-1 mr-3">
                        <input
                          type="checkbox"
                          className="vault-checkbox w-4 h-4"
                          checked={isSelected}
                          onChange={() => toggleVault(vaultId)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          className="size-4 flex-shrink-0"
                          fill={theme === "light" ? "#4A5565" : "#98A1AE"}
                        >
                          <path d="M320 128C426 128 512 214 512 320C512 426 426 512 320 512C254.8 512 197.1 479.5 162.4 429.7C152.3 415.2 132.3 411.7 117.8 421.8C103.3 431.9 99.8 451.9 109.9 466.4C156.1 532.6 233 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C234.3 64 158.5 106.1 112 170.7L112 144C112 126.3 97.7 112 80 112C62.3 112 48 126.3 48 144L48 256C48 273.7 62.3 288 80 288L104.6 288C105.1 288 105.6 288 106.1 288L192.1 288C209.8 288 224.1 273.7 224.1 256C224.1 238.3 209.8 224 192.1 224L153.8 224C186.9 166.6 249 128 320 128zM344 216C344 202.7 333.3 192 320 192C306.7 192 296 202.7 296 216L296 320C296 326.4 298.5 332.5 303 337L375 409C384.4 418.4 399.6 418.4 408.9 409C418.2 399.6 418.3 384.4 408.9 375.1L343.9 310.1L343.9 216z" />
                        </svg>

                        <span
                          className={`text-xs ${
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {confirmedAt}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex items-center text-sm gap-1 ${lockColor}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span>
                        {vault.confirmations >= 6
                          ? "6+"
                          : vault.confirmations >= 3
                          ? `${vault.confirmations}/6`
                          : `${vault.confirmations}/6`}
                      </span>
                    </div>
                  </div>

                  {/* Vault content */}
                  <div className="flex w-full justify-between items-start">
                    <div className="flex gap-3 w-full">
                      <div className="flex flex-col gap-1 w-full overflow-hidden">
                        {/* Vault ID & USDB */}
                        <div className="flex justify-between items-center w-full">
                          <div
                            className={`font-semibold text-sm truncate ${
                              theme === "light"
                                ? "text-gray-800"
                                : "text-gray-100"
                            }`}
                          >
                            Vault #{vaultId}
                          </div>
                          <div
                            className={`font-semibold text-sm text-right truncate ${
                              theme === "light"
                                ? "text-gray-900"
                                : "text-gray-100"
                            }`}
                            title={`${usdbAmount} USDBZ`}
                          >
                            {usdbAmount} USDBZ
                          </div>
                        </div>

                        {/* Collateral Info */}
                        <div
                          className={`flex justify-between text-xs w-full ${
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          <div>Collateral:</div>
                          <div>{collateralRequired} BTC</div>
                        </div>

                        {/* Transaction ID */}
                        <div
                          className={`flex justify-between items-center text-xs w-full ${
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          <span>Tx ID</span>
                          {txId && (
                            <div className="flex items-center gap-1 min-w-0">
                              <span className="text-xs hover:underline truncate max-w-[120px]">
                                {txId}
                              </span>
                              <a
                                href={`https://mempool.space/testnet4/tx/${txId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline "
                                title={txId}
                              >
                                <svg
                                  width="100%"
                                  height="100%"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="size-4 font-bold hover:underline "
                                >
                                  <path
                                    d="M6 18L18 6M18 6H10M18 6V14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill={
                                      theme === "light" ? "#4A5565" : "#98A1AE"
                                    }
                                  />
                                </svg>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Collateral Ratio Row */}
                        <div
                          className={`flex justify-between items-center text-xs w-full ${
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          <span>Collateral Ratio</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs">{collateralRatio}%</span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-md ${ratioColor}`}
                            >
                              {ratioLabel}
                            </span>
                            {ratioLabel === "At Risk" && (
                              <button
                                className={` border px-2 py-0.5 rounded-md ${
                                  theme === "light"
                                    ? "border-black text-black"
                                    : "text-[#dbdbdb] border border-[rgba(255, 255, 255, 1)]"
                                }`}
                              >
                                Top Up
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
