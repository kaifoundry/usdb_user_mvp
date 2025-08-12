export interface ConfirmationRequest {
  txid: string;
  paymentAddress: string;
  vaultAddress: string;
  collateralRequired: number;
  btcPrice: number;
  priceTimestamp: number;
  mintTimestamp: number;
}

export interface ConfirmationResponse {
  status: boolean;
  confirmations?: number;
  message:string;
}
