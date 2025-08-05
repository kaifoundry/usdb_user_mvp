export interface SignPsbtParams {
  psbtBase64: string;
  signInputs: Record<string, number[]>;
  broadcast?: boolean;
}

export interface SignPsbtResult {
  psbt: string;  
  txid?: string; 
}