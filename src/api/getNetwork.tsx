import Wallet from 'sats-connect';
import type { RpcError, RpcResult } from 'sats-connect';

type NetworkInfo = {
  name: string;
};

export type GetNetworkResponse = {
  bitcoin: NetworkInfo;
  stacks: NetworkInfo;
};

type WalletResponse<T> = 
  | { status: 'success'; result: T }
  | { status: 'error'; error: RpcError };

export async function getNetwork(): Promise<WalletResponse<GetNetworkResponse>> {
  const res: RpcResult<'wallet_getNetwork'> = await Wallet.request('wallet_getNetwork', undefined);

  if (res.status === 'error') {
    console.error('Failed to fetch network:', res.error);
    return { status: 'error', error: res.error };
  }

  return { status: 'success', result: res.result };
}
