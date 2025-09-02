export interface AuctionLiquidationRequest {
  mintTxid: string;
  paymentAddress: string;
  ordinalAddress: string;
  ordinalPublicKey: string;
  paymentAddressPublicKey: string;
  currentClaimPrice: number;

}
export interface AuctionLiquidationResponse {
  success?: boolean;
  message?: string;
  data?: {
    psbt: string;
    mintTxid: string;
  };
}

export interface AuctionVault {
  id: string
  vaultId: string
  liquidationStarted: string
  auctionStartTs: number
  txId: string
  vaultCollateral: {
    amount: number
    currency: string
  }
  lot: {
    amount: number
    currency: string
  }
  currentClaimPrice: {
    amount: number
    unit: string
    currency: string
  }
}
export interface AuctionLiquidationState {
  data: {
    mintTxid: string;
    psbt: string;
  };
  paymentAddress: string;
  ordinalAddress: string;
}

export interface AuctionVaultListProps {
  onClaim: (mintTxid: string, currentClaimPrice: string

  ) => void

}