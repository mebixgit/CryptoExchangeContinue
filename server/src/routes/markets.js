import express from 'express';
import binance from '../providers/binance.js';
import coinbase from '../providers/coinbase.js';
import kraken from '../providers/kraken.js';

const router = express.Router();
const providers = [binance, coinbase, kraken];

// GET /api/markets - Get available markets from all providers
router.get('/', async (req, res) => {
  try {
    const results = await Promise.allSettled(
      providers.map(provider => provider.getMarkets())
    );

    const markets = {
      binance: [],
      coinbase: [],
      kraken: []
    };

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const providerName = providers[index].name.toLowerCase();
        markets[providerName] = result.value;
      }
    });

    // Get unique base assets across all providers
    const uniqueAssets = new Set();
    Object.values(markets).forEach(providerMarkets => {
      providerMarkets.forEach(market => uniqueAssets.add(market.baseAsset));
    });

    res.json({
      success: true,
      data: {
        markets,
        uniqueAssets: Array.from(uniqueAssets).sort(),
        totalMarkets: Object.values(markets).reduce((sum, m) => sum + m.length, 0)
      },
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching markets:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
