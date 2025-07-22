import { useCallback } from 'react';

/**
 * 1 BTC = 100,000,000 Satoshis
 */

const SATOSHIS_PER_BTC = 100_000_000;

const useBTCConverter = () => {
  const satsToBtc = useCallback((satoshis: number): string => {
    return !isNaN(satoshis) ? (satoshis / SATOSHIS_PER_BTC).toFixed(8) : '0.00000000';
  }, []);

  const btcToSats = useCallback((btc: number): number => {
    return !isNaN(btc) ? Math.round(btc * SATOSHIS_PER_BTC) : 0;
  }, []);

  return { satsToBtc, btcToSats };
};

export default useBTCConverter;

