import { type RuneBalance } from "../api/getRunesBalance";
import type { CombinedTransactionStatus } from "../types/transactionApiResponse";

interface Props {
  vaults: RuneBalance[];
  selectedVaults: string[];
  toggleVault: (id: string) => void;
  toggleSelectAll: () => void;
  allSelected: boolean;
  totalDebt: number;
  totalCollateral: number;
  handleWithdraw: () => void;
  transactionStatus: CombinedTransactionStatus | null;
  txIds: string[] | undefined;
}

export default function WithdrawPanel({
  vaults,
  selectedVaults,
  toggleVault,
  toggleSelectAll,
  allSelected,
  totalDebt,
  totalCollateral,
  transactionStatus,
  txIds,
}: Props) {
  console.log("txIds", txIds);
  const isConfirmed = transactionStatus?.primary?.confirmed === true;

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
            disabled={!isConfirmed}
          />
        </div>
      </div>

      <div className="mt-2 space-y-3 max-h-60 overflow-y-auto hide-scrollbar  ">
        {vaults
          .filter((vault) => vault.id !== undefined)
          .map((vault, index) => {
            const isSelected = selectedVaults.includes(vault.id!);

            return (
              <div
                key={index}
                className={`vault-item p-4 rounded-lg border app-card${
                  !isConfirmed
                    ? "border-[#5E582F]"
                    : isSelected
                    ? "vault-item-selected"
                    : "border-[#333]"
                }`}
              >
                {!isConfirmed && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-[#83793d] text-white rounded-md">
                        In Progress
                      </span>
                      <span className="text-xs text-muted">
                        about 20 hours ago
                      </span>
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
                      <span>6+</span>
                    </div>
                  </div>
                )}
                <div className="flex w-full justify-between items-start py-2 border-gray-200">
                  <div className="flex items-start gap-3 w-full">
                    {isConfirmed && (
                      <input
                        type="checkbox"
                        className="vault-checkbox w-5 h-5 mt-1"
                        checked={isSelected}
                        onChange={() => toggleVault(vault.id!)}
                      />
                    )}

                    <div className="flex flex-col w-full gap-1">
                      <div className="flex justify-between items-center w-full">
                        <div className="font-semibold text-sm truncate">
                          Vault #{vault.id}
                        </div>
                        <div
                          className="font-semibold text-sm text-right truncate"
                          title={`${vault.amount} ${vault.runeName}`}
                        >
                          {vault.amount} {vault.runeName}
                        </div>
                      </div>
                      <div className="flex justify-between items-center w-full text-muted text-xs">
                        <div>Collateral: 5000 sats</div>
                        <div>Debt</div>
                      </div>
                      {txIds?.[index] && (
                        <a
                          href={`https://mempool.space/testnet4/tx/${txIds[index]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-xs truncate w-1/4"
                        >
                          {txIds[index]}
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
            <span>${totalDebt.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Collateral to Withdraw</span>
            <span>{totalCollateral.toFixed(6)} BTC</span>
          </div>
        </div>
      </div>
    </>
  );
}
