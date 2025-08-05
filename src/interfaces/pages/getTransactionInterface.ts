export interface VaultTransaction {
  id: number;
  user_id: string;
  vault_address: string;
  descriptor_checksum: string | null;
  tx_id: string;
  confirmations: number;
  status: 'pending' | 'confirmed' | 'failed' | string;
  btc_locked: number;
  usdb_amount: number;
  created_at: string;      
  confirmed_at: string;    
}