import type { Vault } from "../types/vault";



export const MOCK_BTC_PRICE = 65000;
export const MIN_COLLATERAL_RATIO = 1.5;

export const MOCK_VAULTS: Vault[] = [
  { id: 1, debt: 200, collateral: 0.006154 },
  { id: 2, debt: 500, collateral: 0.015385 },
  { id: 3, debt: 100, collateral: 0.003077 },
  { id: 4, debt: 1000, collateral: 0.030769 },
];
