import { useTimeAgo } from "../Hooks/useTimeAgo";
import type { WithDrawPanelProps } from "../interfaces/components/withDrawPanelInterface";
import time from "../assets/Frame.svg";
export default function WithdrawPanel({
  vaults,
  selectedVaults,
  toggleVault,
  toggleSelectAll,
  allSelected,
  totalDebt,
  totalCollateral,
}: WithDrawPanelProps) {
  return (
    <>
      <div className="flex items-center justify-between mt-6">
        <label className="text-sm text-muted">Select vaults to close</label>
        <div className="flex items-center gap-2">
          <span className="text-sm">Select All</span>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="w-4 h-4 vault-checkbox"
disabled          />
        </div>
      </div>

      <div className="mt-2 space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
        {vaults
          .filter((vault) => vault.id !== undefined)
          .map((vault) => {
            const vaultId = vault.id?.toString();
            const vaultStatus = vault.status;
            const isSelected = selectedVaults.includes(vaultId);
            const isConfirmed = vaultStatus === "confirmed";
            const confirmedAt = vault.confirmed_at
              ? useTimeAgo(vault.confirmed_at)
              : "Pending";
            const txId = vault.tx_id;
            const usdbAmount = vault.usdb_amount ?? 0;
            const btcLocked = vault.btc_locked ?? 0;
            const confirmations = vault.confirmations ?? 0;

            return (
              <div
                key={vaultId}
                className={`vault-item p-4 rounded-lg border app-card ${
                  !vaultStatus
                    ? "border-[#5E582F]"
                    : isSelected
                    ? "vault-item-selected"
                    : "border-[#333]"
                }`}
              >
                {!vaultStatus && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-[#83793d] text-white rounded-md">
                        {isConfirmed ? "Confirmed" : "In Progress"}
                      </span>
                      <img src={time} alt="time" className="w-4 h-4" />
                      <span className="text-xs text-muted">{confirmedAt}</span>
                    </div>
                    <div className="flex items-center text-sm text-green-500 gap-1">
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
                      <span>{confirmations}+</span>
                    </div>
                  </div>
                )}

                <div className="flex w-full justify-between items-start py-3 border-gray-200">
                  <div className="flex gap-3 w-full">
                    {vaultStatus && (
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          className="vault-checkbox w-5 h-5"
                          checked={isSelected}
                          onChange={() => toggleVault(vaultId)}
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-1 w-full overflow-hidden">
                      {/* Vault ID & USDB */}
                      <div className="flex justify-between items-center w-full">
                        <div className="font-semibold text-sm truncate">
                          Vault #{vaultId}
                        </div>
                        <div
                          className="font-semibold text-sm text-right truncate"
                          title={`${usdbAmount} USDB`}
                        >
                          {usdbAmount} USDB
                        </div>
                      </div>

                      {/* Collateral Info */}
                      <div className="flex justify-between text-muted text-xs w-full">
                        <div>Collateral: {btcLocked} sats</div>
                        <div>Debt</div>
                      </div>

                      {/* Transaction ID Link */}
                      {txId && (
                        <a
                          href={`https://mempool.space/testnet4/tx/${txId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs hover:underline truncate max-w-[60%]"
                          title={txId}
                        >
                          {txId}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-lg font-semibold mb-4">Summary</div>
        <div className="text-sm text-muted space-y-2">
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
