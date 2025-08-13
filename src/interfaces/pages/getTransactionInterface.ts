export interface VaultTransaction {
  id: number;
  user_id: string;
  vault_address: string;
  descriptor_checksum: string | null;
  tx_id: string;
  confirmations: number;
  status: 'pending' | 'confirmed' | 'failed' | string;
  collateral_required: number;
  collateral_ratio: number;
  btc_price: string;
  btc_locked: number;
  usdb_amount: number;
  created_at: string;
  confirmed_at: string | null;
  price_timestamp: string;
  mint_timestamp: string;
}
