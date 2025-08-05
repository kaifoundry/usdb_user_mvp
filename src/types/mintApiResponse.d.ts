export interface MintData {
  data: MintApiResponse;
  paymentAddress: string;
}
 export type MintApiResponse = {
  message: string; 
  finalPsbt: {
    modifiedPsbt: string;
    selectedInputs: any[];
  userVisibleOutputs?: Array<Record<string, number>>;
  };
  vault_address: string;
};

export type OutputData = Array<{
  address: string;
  amount: string;
}>;