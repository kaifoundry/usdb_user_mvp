export interface ConfirmationRequest {
  txid: string;
  paymentAddress: string;
  vaultAddress: string;
}

 export interface ConfirmationResponse {
  status: boolean;
  confirmations?: number;

};