import express from 'express';
import binance from '../providers/binance.js';
import coinbase from '../providers/coinbase.js';
import kraken from '../providers/kraken.js';

const router = express.Router();
const providers = [binance, coinbase, kraken];

// Estimated fee percentage for exchange calculations
const ESTIMATED_FEE_RATE = 0.001; // 0.1%

// GET /api/exchange/quote - Get exchange quotes from all providers
router.get('/quote', async (req, res) => {
  try {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: from, to, amount'
      });
    }

    const fromSymbol = from.toUpperCase();
    const toSymbol = to.toUpperCase();
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }

    // For simplicity, we'll assume quotes are against USD
    // Get prices for both symbols from all providers
    const [fromPrices, toPrices] = await Promise.all([
      Promise.allSettled(providers.map(p => p.getPrice(fromSymbol))),
      Promise.allSettled(providers.map(p => p.getPrice(toSymbol)))
    ]);

    const quotes = [];

    providers.forEach((provider, index) => {
      const fromPrice = fromPrices[index].status === 'fulfilled' ? fromPrices[index].value : null;
      const toPrice = toPrices[index].status === 'fulfilled' ? toPrices[index].value : null;

      if (fromPrice && toPrice) {
        // Calculate exchange rate
        const exchangeRate = fromPrice.price / toPrice.price;
        const outputAmount = amountNum * exchangeRate;
        const estimatedFee = outputAmount * ESTIMATED_FEE_RATE;
        const finalAmount = outputAmount - estimatedFee;

        quotes.push({
          provider: provider.name,
          from: fromSymbol,
          to: toSymbol,
          inputAmount: amountNum,
          outputAmount: finalAmount,
          exchangeRate,
          estimatedFee,
          fromPrice: fromPrice.price,
          toPrice: toPrice.price,
          timestamp: Date.now()
        });
      }
    });

    if (quotes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No quotes available for this pair'
      });
    }

    // Find best quote (highest output amount)
    const bestQuote = quotes.reduce((best, current) => 
      current.outputAmount > best.outputAmount ? current : best
    );

    res.json({
      success: true,
      data: {
        quotes,
        bestQuote,
        recommendedProvider: bestQuote.provider
      },
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error getting exchange quote:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/exchange/compare/:pair - Compare prices for a trading pair
router.get('/compare/:pair', async (req, res) => {
  try {
    const pair = req.params.pair.toUpperCase();
    const [from, to] = pair.split('-');

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pair format. Use format: BTC-ETH'
      });
    }

    // Get prices from all providers
    const [fromResults, toResults] = await Promise.all([
      Promise.allSettled(providers.map(p => p.get24hStats(from))),
      Promise.allSettled(providers.map(p => p.get24hStats(to)))
    ]);

    const comparison = providers.map((provider, index) => {
      const fromData = fromResults[index].status === 'fulfilled' ? fromResults[index].value : null;
      const toData = toResults[index].status === 'fulfilled' ? toResults[index].value : null;

      if (fromData && toData) {
        return {
          provider: provider.name,
          pair,
          from: fromData,
          to: toData,
          exchangeRate: fromData.price / toData.price,
          available: true
        };
      }

      return {
        provider: provider.name,
        pair,
        available: false
      };
    }).filter(c => c.available);

    res.json({
      success: true,
      data: {
        pair,
        comparison,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Error comparing pair:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
