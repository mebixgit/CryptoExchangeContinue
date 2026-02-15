import axios from 'axios';

const BASE_URL = 'https://api.binance.com/api/v3';

class BinanceProvider {
  constructor() {
    this.name = 'Binance';
    this.isAvailable = true;
  }

  async getPrice(symbol) {
    try {
      const formattedSymbol = `${symbol.toUpperCase()}USDT`;
      const response = await axios.get(`${BASE_URL}/ticker/price`, {
        params: { symbol: formattedSymbol },
        timeout: 5000
      });
      return {
        provider: this.name,
        symbol,
        price: parseFloat(response.data.price),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Binance API error for ${symbol}:`, error.message);
      return null;
    }
  }

  async getPrices(symbols) {
    try {
      const response = await axios.get(`${BASE_URL}/ticker/price`, {
        timeout: 5000
      });
      
      const prices = {};
      symbols.forEach(symbol => {
        const ticker = response.data.find(
          t => t.symbol === `${symbol.toUpperCase()}USDT`
        );
        if (ticker) {
          prices[symbol] = {
            provider: this.name,
            symbol,
            price: parseFloat(ticker.price),
            timestamp: Date.now()
          };
        }
      });
      return prices;
    } catch (error) {
      console.error('Binance API error:', error.message);
      return {};
    }
  }

  async get24hStats(symbol) {
    try {
      const formattedSymbol = `${symbol.toUpperCase()}USDT`;
      const response = await axios.get(`${BASE_URL}/ticker/24hr`, {
        params: { symbol: formattedSymbol },
        timeout: 5000
      });
      return {
        provider: this.name,
        symbol,
        price: parseFloat(response.data.lastPrice),
        change24h: parseFloat(response.data.priceChangePercent),
        volume24h: parseFloat(response.data.volume),
        high24h: parseFloat(response.data.highPrice),
        low24h: parseFloat(response.data.lowPrice),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Binance 24h stats error for ${symbol}:`, error.message);
      return null;
    }
  }

  async getMarkets() {
    try {
      const response = await axios.get(`${BASE_URL}/exchangeInfo`, {
        timeout: 5000
      });
      
      const usdtPairs = response.data.symbols
        .filter(s => s.quoteAsset === 'USDT' && s.status === 'TRADING')
        .slice(0, 50) // Limit to top 50
        .map(s => ({
          provider: this.name,
          baseAsset: s.baseAsset,
          quoteAsset: s.quoteAsset,
          symbol: s.symbol
        }));
      
      return usdtPairs;
    } catch (error) {
      console.error('Binance markets error:', error.message);
      return [];
    }
  }

  async checkStatus() {
    try {
      const response = await axios.get(`${BASE_URL}/ping`, { timeout: 3000 });
      this.isAvailable = true;
      return {
        provider: this.name,
        status: 'online',
        latency: response.headers['x-mbx-used-weight'] || 'N/A',
        timestamp: Date.now()
      };
    } catch (error) {
      this.isAvailable = false;
      return {
        provider: this.name,
        status: 'offline',
        error: error.message,
        timestamp: Date.now()
      };
    }
  }
}

export default new BinanceProvider();
