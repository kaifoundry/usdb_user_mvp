export type TransactionApiResponse = {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
};
export type CombinedTransactionStatus = {
  primary: TransactionApiResponse;
  mempoolTimestamps: number[]; 
};
