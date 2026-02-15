import { useState } from 'react';
import { priceService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice, getCryptoIcon } from '../utils/formatters';

const Exchange = () => {
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('ETH');
  const [amount, setAmount] = useState('1');
  const [quotes, setQuotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const symbols = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOGE', 'MATIC', 'DOT', 'LTC', 'LINK'];

  const handleGetQuote = async () => {
    if (fromCurrency === toCurrency) {
      setError('Please select different currencies');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await priceService.getExchangeQuote(fromCurrency, toCurrency, amount);
      setQuotes(result.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setQuotes(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Crypto Exchange</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get the best exchange rates from multiple providers
        </p>
      </div>

      <div className="card mb-8">
        <div className="space-y-6">
          {/* From Currency */}
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <div className="flex space-x-4">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {symbols.map(symbol => (
                  <option key={symbol} value={symbol}>
                    {getCryptoIcon(symbol)} {symbol}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                min="0"
                step="0.000001"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Swap currencies"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {symbols.map(symbol => (
                <option key={symbol} value={symbol}>
                  {getCryptoIcon(symbol)} {symbol}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGetQuote}
            disabled={loading}
            className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Getting Quotes...' : 'Get Quote'}
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

      {quotes && !loading && (
        <div className="space-y-6">
          {quotes.bestQuote && (
            <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
                  🏆 Best Rate
                </h3>
                <span className="text-sm px-3 py-1 rounded-full bg-green-600 text-white">
                  {quotes.recommendedProvider}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span>You send:</span>
                  <span className="font-semibold">{quotes.bestQuote.inputAmount} {fromCurrency}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>You receive:</span>
                  <span className="font-bold text-2xl text-green-600 dark:text-green-400">
                    {quotes.bestQuote.outputAmount.toFixed(6)} {toCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Exchange Rate:</span>
                  <span>1 {fromCurrency} = {quotes.bestQuote.exchangeRate.toFixed(6)} {toCurrency}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Estimated Fee:</span>
                  <span>{quotes.bestQuote.estimatedFee.toFixed(6)} {toCurrency}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold mb-4">All Quotes</h3>
            <div className="space-y-4">
              {quotes.quotes.map((quote, index) => (
                <div
                  key={index}
                  className={`card ${quote.provider === quotes.recommendedProvider ? 'border-2 border-green-500' : ''}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg">{quote.provider}</h4>
                    {quote.provider === quotes.recommendedProvider && (
                      <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        Best Rate
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Output Amount</p>
                      <p className="font-semibold">{quote.outputAmount.toFixed(6)} {toCurrency}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Exchange Rate</p>
                      <p className="font-semibold">{quote.exchangeRate.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">{fromCurrency} Price</p>
                      <p className="font-semibold">{formatPrice(quote.fromPrice)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">{toCurrency} Price</p>
                      <p className="font-semibold">{formatPrice(quote.toPrice)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exchange;
