import { useEffect, useState } from 'react';

const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

const fetchBTCPrice = async (): Promise<number | null> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.bitcoin.usd;
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    return null;
  }
};

export const useBTCPrice = (): number | null => {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const updatePrice = async () => {
      const newPrice = await fetchBTCPrice();
      if (isMounted && newPrice !== null) {
        setPrice(newPrice);
      }
    };

    updatePrice(); 
    const interval = setInterval(updatePrice, 300_000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return price;
};
