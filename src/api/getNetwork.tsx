import { useEffect, useState } from 'react';
import Wallet from 'sats-connect';
import type { RpcResult, RpcError } from 'sats-connect';
import { useWallet } from './connectWallet';


type NetworkSuccess = {
  status: 'success';
  bitcoin: string;
  stacks: string;
};

type NetworkError = {
  status: 'error';
  error: RpcError;
};

type NetworkResponse = NetworkSuccess | NetworkError;

export function useNetwork(): NetworkResponse | undefined {
  const { wallet } = useWallet();
  const [network, setNetwork] = useState<NetworkResponse>();

  useEffect(() => {
   if(wallet){

    async function fetchNetwork() {
      try {
        const res: RpcResult<'wallet_getNetwork'> = await Wallet.request(
          'wallet_getNetwork',
          undefined
        );

        if (res.status === 'error') {
          setNetwork({ status: 'error', error: res.error });
        } else {
          setNetwork({
            status: 'success',
            bitcoin: res.result.bitcoin.name,
            stacks: res.result.stacks.name,
          });
        }
      } catch (err) {
          setNetwork({
            status: 'error',
            error: { code: -1, message: (err as Error).message },
          });
      }
    }

    fetchNetwork();
  }
  }, [wallet]);

  return network;
}
