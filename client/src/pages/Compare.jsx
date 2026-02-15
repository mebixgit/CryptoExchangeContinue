import { useState } from 'react';
import { priceService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice, getCryptoIcon } from '../utils/formatters';

const Compare = () => {
  const [fromSymbol, setFromSymbol] = useState('BTC');
  const [toSymbol, setToSymbol] = useState('ETH');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);

  const symbols = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOGE', 'MATIC', 'DOT', 'LTC', 'LINK'];

  const handleCompare = async () => {
    if (fromSymbol === toSymbol) {
      setError('Please select different cryptocurrencies');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await priceService.comparePair(`${fromSymbol}-${toSymbol}`);
      setComparison(result.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Price Comparison</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compare cryptocurrency prices across different providers
        </p>
      </div>

      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <select
              value={fromSymbol}
              onChange={(e) => setFromSymbol(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {symbols.map(symbol => (
                <option key={symbol} value={symbol}>
                  {getCryptoIcon(symbol)} {symbol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <select
              value={toSymbol}
              onChange={(e) => setToSymbol(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {symbols.map(symbol => (
                <option key={symbol} value={symbol}>
                  {getCryptoIcon(symbol)} {symbol}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {comparison && !loading && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">
            {comparison.pair} Exchange Rate Comparison
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparison.comparison.map((provider) => (
              <div key={provider.provider} className="card">
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-1">{provider.provider}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Exchange Rate</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{fromSymbol} Price</p>
                    <p className="text-lg font-semibold">{formatPrice(provider.from.price)}</p>
                    {provider.from.change24h !== undefined && (
                      <p className={`text-sm ${provider.from.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {provider.from.change24h >= 0 ? '+' : ''}{provider.from.change24h.toFixed(2)}% (24h)
                      </p>
                    )}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{toSymbol} Price</p>
                    <p className="text-lg font-semibold">{formatPrice(provider.to.price)}</p>
                    {provider.to.change24h !== undefined && (
                      <p className={`text-sm ${provider.to.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {provider.to.change24h >= 0 ? '+' : ''}{provider.to.change24h.toFixed(2)}% (24h)
                      </p>
                    )}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Exchange Rate</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {provider.exchangeRate.toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      1 {fromSymbol} = {provider.exchangeRate.toFixed(6)} {toSymbol}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
