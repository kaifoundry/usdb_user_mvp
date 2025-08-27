export interface AuctionLiquidationRequest {
    mintTxid: string;
    paymentAddress: string;
    ordinalsAddress: string;
    ordinalPublicKey: string;
    paymentAddressPublicKey: string;
    currentClaimPrice: string;

}
export interface AuctionLiquidationResponse {
  success: boolean;
  message: string;
  data: {
    psbt: string;
    mintTxid: string;
  };
}
export interface AuctionVault {
  id: string
  vaultId: string
  liquidationStarted: string
  auctionStartTs: string   
  txId: string
  vaultCollateral: {
    amount: string
    currency: string
  }
  lot: {
    amount: string
    currency: string
  }
  currentClaimPrice: {
    amount: string
    unit: string
    currency: string
  }
}

 export interface AuctionVaultListProps {
  onClaim: (mintTxid: string,currentClaimPrice: string

  ) => void

}