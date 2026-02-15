import { useState, useEffect } from 'react';
import { priceService } from '../services/api';

export const usePrices = (symbols, refreshInterval = 30000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchPrices = async () => {
      try {
        setLoading(true);
        const result = await priceService.getPrices(symbols);
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchPrices, refreshInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [JSON.stringify(symbols), refreshInterval]);

  return { data, loading, error };
};

export const useProviderStatus = (refreshInterval = 60000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const result = await priceService.getProvidersStatus();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchStatus, refreshInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshInterval]);

  return { data, loading, error };
};
