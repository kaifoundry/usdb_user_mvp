// import { MOCK_VAULTS } from "../constants/appContsants";
// import type { Vault } from "../types/vault";


// interface Props {
//   vaults: Vault[];
//   selectedVaults: number[];
//   toggleVault: (id: number) => void;
//   totalDebt: number;
//   totalCollateral: number;
//   handleWithdraw: () => void;
// }

// export default function WithdrawPanel({
//   vaults,
//   selectedVaults,
//   toggleVault,
//   totalDebt,
//   totalCollateral,
//   handleWithdraw,
// }: Props) {
//   return (
//      <div className="w-full shrink-0">
//                       {/* Withdraw Panel */}
//                       <div className="mt-6">
//                         <div className="flex items-center justify-between">
//                           <label className="text-sm text-muted">
//                             Select vaults to close
//                           </label>
//                           <input
//                             type="checkbox"
//                             className="vault-checkbox w-5 h-5 pr-2"
//                             checked={selectedVaults.length === MOCK_VAULTS.length}
//                             onChange={() => {
//                               if (selectedVaults.length === MOCK_VAULTS.length) {
//                                 setSelectedVaults([]);
//                               } else {
//                                 setSelectedVaults(MOCK_VAULTS.map((v) => v.id));
//                               }
//                             }}
//                           />
//                         </div>
    
//                         <div className="mt-2 space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
//                           {MOCK_VAULTS.map((vault) => (
//                             <div
//                               key={vault.id}
//                               className={`vault-item flex items-center justify-between p-4 rounded-lg ${
//                                 selectedVaults.includes(vault.id)
//                                   ? "vault-item-selected"
//                                   : ""
//                               }`}
//                             >
//                               <div className="flex items-center gap-4">
//                                 <input
//                                   type="checkbox"
//                                   className="vault-checkbox w-5 h-5"
//                                   checked={selectedVaults.includes(vault.id)}
//                                   onChange={() => toggleVaultSelection(vault.id)}
//                                 />
//                                 <div>
//                                   <div className="font-semibold">Vault #{vault.id}</div>
//                                   <div className="text-sm text-muted">
//                                     Collateral: {vault.collateral.toFixed(6)} BTC
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="font-semibold">
//                                   {vault.debt.toFixed(2)} USDB
//                                 </div>
//                                 <div className="text-sm text-muted">Debt</div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                         <div
//                           className="mt-6 pt-4 border-t"
//                           style={{ borderColor: "var(--card-border-color)" }}
//                         >
//                           <div className="text-lg font-semibold mb-4">Summary</div>
//                           <div className="text-sm text-muted space-y-2">
//                             <div className="flex justify-between">
//                               <span>Total to Repay</span>
//                               <span>{totalSelectedDebt.toFixed(2)} USDB</span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span>Collateral to Withdraw</span>
//                               <span>{totalSelectedCollateral.toFixed(6)} BTC</span>
//                             </div>
//                           </div>
//                         </div>
//                         <button
//                           onClick={handleWithdraw}
//                           className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-lg text-lg"
//                         >
//                           Withdraw Selected
//                         </button>
//                       </div>
//                     </div>
//   );
// }
