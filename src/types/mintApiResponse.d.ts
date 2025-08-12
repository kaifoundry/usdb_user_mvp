export interface MintData {
  data: MintApiResponse;
  paymentAddress: string;
}

export type MintApiResponse = {
  message: string;
  psbt: {
    modifiedPsbt: string;
    totalInputs: number;
    userVisibleOutputs?: Array<Record<string, number>>;
  };
  vaultAddress: string;
  collateralRequired: number;
  btcPrice: number;
  priceTimestamp: number;
};

export type OutputData = Array<{
  address: string;
  amount: string;
}>;
