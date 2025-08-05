import type { MessageSigningProtocols } from "sats-connect";

export interface SignMessageParams {
  address: string;
  message: string;
  protocol?: MessageSigningProtocols;
}

export interface SignMessageResult {
  signature: string;
  messageHash: string;
  address: string;
}