import React from "react";
import { useTimeAgo } from "../Hooks/useTimeAgo";
import type { Theme } from "../types/theme";
import type { VaultTransaction } from "../interfaces/pages/getTransactionInterface";

interface VaultCardProps {
  vault: VaultTransaction;
  theme: Theme;
  isSelected: boolean;
  toggleVault: (vaultId: string) => void;
}

export const VaultCard: React.FC<VaultCardProps> = ({
  vault,
  theme,
  isSelected,
  toggleVault,
}) => {
  const vaultId = vault?.id?.toString();
  const vaultStatus = vault?.status;
  const confirmedAt = vault?.confirmed_at
    ? useTimeAgo(vault?.confirmed_at ?? undefined)
    : "Not confirmed yet..";
  const txId = vault?.tx_id ?? "No transanction";
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
    vaultStatus === "confirmed" ? "text-green-500" : "text-yellow-500";

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
      ? "border-2 border-dashed border-[#3A3A3A]"
      : isSelected
      ? theme === "light"
        ? "border-[#D6D6D6] border-2"
        : "border-[#3A3A3A] border-2"
      : theme === "light"
      ? "border-[#D6D6D6] border-2"
      : "border-[#3A3A3A] border-2";

  const bgStyle = isSelected
    ? theme === "light"
      ? "bg-[#F0F0F0]"
      : "bg-[#242424]"
    : theme === "light"
    ? "bg-[rgba(255,255,255,0.7)]"
    : "bg-[rgba(23,23,23,0.7)]";

  return (
    <div key={vaultId} className={` p-4 rounded-lg ${borderStyle} ${bgStyle}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-between">
          {vaultStatus === "confirmed" && (
            <div className="pt-1 mr-3">
              <input
                type="checkbox"
                className="vault-checkbox w-4 h-4"
                checked={isSelected}
                onChange={() => toggleVault(vaultId)}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-md ${statusColor}`}>
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
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {confirmedAt}
            </span>
          </div>
        </div>
        <div className={`flex items-center text-sm gap-1 ${lockColor}`}>
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
                  theme === "light" ? "text-gray-800" : "text-gray-100"
                }`}
              >
                Vault #{vaultId}
              </div>
              <div
                className={`font-semibold text-sm text-right truncate ${
                  theme === "light" ? "text-gray-900" : "text-gray-100"
                }`}
                title={`${usdbAmount} USDBZ`}
              >
                {usdbAmount} USDBZ
              </div>
            </div>

            {/* Collateral Info */}
            <div
              className={`flex justify-between text-xs w-full ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              <div>Collateral:</div>
              <div>{collateralRequired} BTC</div>
            </div>

            {/* Transaction ID */}
            <div
              className={`flex justify-between items-center text-xs w-full ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
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
                        fill={theme === "light" ? "#4A5565" : "#98A1AE"}
                      />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {/* Collateral Ratio Row */}
            <div
              className={`flex justify-between items-center text-xs w-full ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
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
};
