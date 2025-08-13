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
  txid: string;
  
}

export interface LiquidationState {
  data: {
    complete: boolean;
    psbt: string;
  };
  paymentAddress: string;
  ordinalsAddress: string;
  txid: string;
}