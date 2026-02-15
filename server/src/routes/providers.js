import express from 'express';
import binance from '../providers/binance.js';
import coinbase from '../providers/coinbase.js';
import kraken from '../providers/kraken.js';

const router = express.Router();
const providers = [binance, coinbase, kraken];

// GET /api/providers/status - Get status of all providers
router.get('/status', async (req, res) => {
  try {
    const statusChecks = await Promise.allSettled(
      providers.map(provider => provider.checkStatus())
    );

    const statuses = statusChecks.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return {
        provider: providers[index].name,
        status: 'error',
        error: result.reason?.message || 'Unknown error',
        timestamp: Date.now()
      };
    });

    const allOnline = statuses.every(s => s.status === 'online');

    res.json({
      success: true,
      data: {
        providers: statuses,
        overallStatus: allOnline ? 'healthy' : 'degraded',
        onlineCount: statuses.filter(s => s.status === 'online').length,
        totalCount: providers.length
      },
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error checking provider status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
