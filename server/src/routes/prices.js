import express from 'express';
import binance from '../providers/binance.js';
import coinbase from '../providers/coinbase.js';
import kraken from '../providers/kraken.js';

const router = express.Router();
const providers = [binance, coinbase, kraken];

// Default crypto symbols to fetch
const DEFAULT_SYMBOLS = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOGE', 'MATIC', 'DOT'];

// GET /api/prices - Get prices from all providers
router.get('/', async (req, res) => {
  try {
    const symbols = req.query.symbols 
      ? req.query.symbols.split(',').map(s => s.trim().toUpperCase())
      : DEFAULT_SYMBOLS;

    const results = await Promise.allSettled(
      providers.map(provider => provider.getPrices(symbols))
    );

    const prices = {};
    symbols.forEach(symbol => {
      prices[symbol] = {
        symbol,
        providers: []
      };
    });

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        Object.entries(result.value).forEach(([symbol, data]) => {
          if (prices[symbol]) {
            prices[symbol].providers.push(data);
          }
        });
      }
    });

    // Add best price information
    Object.values(prices).forEach(priceData => {
      if (priceData.providers.length > 0) {
        const sorted = [...priceData.providers].sort((a, b) => a.price - b.price);
        priceData.bestBuy = sorted[0]; // Lowest price (best for buying)
        priceData.bestSell = sorted[sorted.length - 1]; // Highest price (best for selling)
        priceData.averagePrice = priceData.providers.reduce((sum, p) => sum + p.price, 0) / priceData.providers.length;
      }
    });

    res.json({
      success: true,
      data: prices,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/prices/:symbol - Get price for specific symbol from all providers
router.get('/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    
    const results = await Promise.allSettled(
      providers.map(provider => provider.get24hStats(symbol))
    );

    const providerData = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);

    if (providerData.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No data found for symbol ${symbol}`
      });
    }

    // Calculate best prices
    const sorted = [...providerData].sort((a, b) => a.price - b.price);
    const bestBuy = sorted[0];
    const bestSell = sorted[sorted.length - 1];
    const averagePrice = providerData.reduce((sum, p) => sum + p.price, 0) / providerData.length;

    res.json({
      success: true,
      data: {
        symbol,
        providers: providerData,
        bestBuy,
        bestSell,
        averagePrice,
        priceSpread: bestSell.price - bestBuy.price,
        priceSpreadPercent: ((bestSell.price - bestBuy.price) / bestBuy.price) * 100
      },
      timestamp: Date.now()
    });
  } catch (error) {
    console.error(`Error fetching price for ${req.params.symbol}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
