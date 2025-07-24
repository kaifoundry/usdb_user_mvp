import { type RuneBalance } from "../api/getRunesBalance";

interface Props {
  vaults: RuneBalance[];
  selectedVaults: string[];
  toggleVault: (id: string) => void;
  toggleSelectAll: () => void;
  allSelected: boolean;
  totalDebt: number;
  totalCollateral: number;
  handleWithdraw: () => void;
}

export default function WithdrawPanel({
  vaults,
  selectedVaults,
  toggleVault,
  toggleSelectAll,
  allSelected,
  totalDebt,
  totalCollateral,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between mt-6">
        <label className="text-sm text-muted">Select vaults to close</label>
        <button onClick={toggleSelectAll} className="text-sm underline">
          {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>
      <div className="mt-2 space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
        {vaults
          .filter((vault) => vault.id !== undefined) 
          .map((vault) => (
            <div
              key={vault.id}
              className={`vault-item flex justify-between p-4 rounded-lg ${
                selectedVaults.includes(vault.id!) ? "vault-item-selected" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  className="vault-checkbox w-5 h-5"
                  checked={selectedVaults.includes(vault.id!)}
                  onChange={() => toggleVault(vault.id!)}
                />
                <div>
                  <div className="font-semibold">Vault #{vault.id}</div>
                  <div className="text-sm text-muted">
                    Collateral: 5000 sats
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {vault.amount} {vault.runeName}
                </div>
                <div className="text-sm text-muted">Debt</div>
              </div>
            </div>
          ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <div className="text-lg font-semibold mb-4">Summary</div>
        <div className="text-sm text-muted space-y-2">
          <div className="flex justify-between">
            <span>Total to Repay</span>
            <span>{totalDebt.toFixed(2)} USDB</span>
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
