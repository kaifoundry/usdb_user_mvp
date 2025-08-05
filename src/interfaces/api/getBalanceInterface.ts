
export interface PaymentBalance {
  confirmed: string; 
  unconfirmed: string; 
  total: string;        
}

export interface GetBalanceResult {
  paymentAddress?: PaymentBalance;
}