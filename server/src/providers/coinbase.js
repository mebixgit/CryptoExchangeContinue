import axios from 'axios';

const BASE_URL = 'https://api.coinbase.com/v2';

class CoinbaseProvider {
  constructor() {
    this.name = 'Coinbase';
    this.isAvailable = true;
  }

  async getPrice(symbol) {
    try {
      const response = await axios.get(
        `${BASE_URL}/prices/${symbol.toUpperCase()}-USD/spot`,
        { timeout: 5000 }
      );
      return {
        provider: this.name,
        symbol,
        price: parseFloat(response.data.data.amount),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Coinbase API error for ${symbol}:`, error.message);
      return null;
    }
  }

  async getPrices(symbols) {
    const prices = {};
    
    // Coinbase doesn't have a batch endpoint, so we'll fetch individually
    const promises = symbols.map(async (symbol) => {
      const price = await this.getPrice(symbol);
      if (price) {
        prices[symbol] = price;
      }
    });
    
    await Promise.allSettled(promises);
    return prices;
  }

  async get24hStats(symbol) {
    try {
      // Get current price
      const spotResponse = await axios.get(
        `${BASE_URL}/prices/${symbol.toUpperCase()}-USD/spot`,
        { timeout: 5000 }
      );
      
      // Get buy/sell prices for additional data
      const buyResponse = await axios.get(
        `${BASE_URL}/prices/${symbol.toUpperCase()}-USD/buy`,
        { timeout: 5000 }
      );
      
      const sellResponse = await axios.get(
        `${BASE_URL}/prices/${symbol.toUpperCase()}-USD/sell`,
        { timeout: 5000 }
      );

      const currentPrice = parseFloat(spotResponse.data.data.amount);
      const buyPrice = parseFloat(buyResponse.data.data.amount);
      const sellPrice = parseFloat(sellResponse.data.data.amount);

      return {
        provider: this.name,
        symbol,
        price: currentPrice,
        buyPrice,
        sellPrice,
        spread: buyPrice - sellPrice,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Coinbase stats error for ${symbol}:`, error.message);
      return null;
    }
  }

  async getMarkets() {
    try {
      const response = await axios.get(`${BASE_URL}/currencies`, {
        timeout: 5000
      });
      
      // Filter to get main cryptocurrencies
      const markets = response.data.data
        .filter(c => c.type === 'crypto')
        .slice(0, 50)
        .map(c => ({
          provider: this.name,
          baseAsset: c.code,
          quoteAsset: 'USD',
          symbol: `${c.code}-USD`,
          name: c.name
        }));
      
      return markets;
    } catch (error) {
      console.error('Coinbase markets error:', error.message);
      return [];
    }
  }

  async checkStatus() {
    try {
      const response = await axios.get(`${BASE_URL}/time`, { timeout: 3000 });
      this.isAvailable = true;
      return {
        provider: this.name,
        status: 'online',
        timestamp: Date.now(),
        serverTime: response.data.data.iso
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

export default new CoinbaseProvider();
