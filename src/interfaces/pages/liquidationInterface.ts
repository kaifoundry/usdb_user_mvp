export interface LiquidationRequest {
  txid: string;
  paymentAddress: string;
  ordinalsAddress: string;
}
export interface LiquidationResponse {
  success?: boolean;
  message: string;
  data: {
    complete: boolean;
    psbt: string;
  };
  numberOfInputs?: number; 
}

export interface LiquidationState {
  data: {
    complete: boolean;
    psbt: string;
  };
  paymentAddress: string;
  ordinalsAddress: string;
}