import { formatPrice, formatPercent, getChangeColor, getCryptoIcon } from '../utils/formatters';

const PriceCard = ({ symbol, data }) => {
  if (!data || !data.providers || data.providers.length === 0) {
    return (
      <div className="card">
        <div className="text-center text-gray-500">No data available</div>
      </div>
    );
  }

  const { bestBuy, bestSell, averagePrice } = data;

  return (
    <div className="card hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{getCryptoIcon(symbol)}</span>
          <div>
            <h3 className="text-xl font-bold">{symbol}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {data.providers.length} provider{data.providers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Average Price</p>
          <p className="text-2xl font-bold">{formatPrice(averagePrice)}</p>
        </div>

        {bestBuy && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Best Buy Price</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-green-600">{formatPrice(bestBuy.price)}</p>
              <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                {bestBuy.provider}
              </span>
            </div>
          </div>
        )}

        {bestSell && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Best Sell Price</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-red-600">{formatPrice(bestSell.price)}</p>
              <span className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                {bestSell.provider}
              </span>
            </div>
          </div>
        )}

        {data.providers.length > 0 && data.providers[0].change24h !== undefined && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">24h Change</p>
            <p className={`text-lg font-semibold ${getChangeColor(data.providers[0].change24h)}`}>
              {formatPercent(data.providers[0].change24h)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceCard;
