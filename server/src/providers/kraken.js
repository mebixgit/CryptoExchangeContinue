import axios from 'axios';

const BASE_URL = 'https://api.kraken.com/0/public';

// Kraken uses different symbol naming (e.g., XXBTZUSD instead of BTCUSD)
const SYMBOL_MAP = {
  'BTC': 'XXBTZUSD',
  'ETH': 'XETHZUSD',
  'SOL': 'SOLUSD',
  'XRP': 'XXRPZUSD',
  'ADA': 'ADAUSD',
  'DOGE': 'XDGZUSD',
  'MATIC': 'MATICUSD',
  'DOT': 'DOTUSD',
  'LTC': 'XLTCZUSD',
  'LINK': 'LINKUSD'
};

class KrakenProvider {
  constructor() {
    this.name = 'Kraken';
    this.isAvailable = true;
  }

  getKrakenSymbol(symbol) {
    return SYMBOL_MAP[symbol.toUpperCase()] || `${symbol.toUpperCase()}USD`;
  }

  async getPrice(symbol) {
    try {
      const krakenSymbol = this.getKrakenSymbol(symbol);
      const response = await axios.get(`${BASE_URL}/Ticker`, {
        params: { pair: krakenSymbol },
        timeout: 5000
      });

      const data = response.data.result;
      const pairData = data[Object.keys(data)[0]];
      
      if (!pairData) return null;

      return {
        provider: this.name,
        symbol,
        price: parseFloat(pairData.c[0]), // Last trade price
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Kraken API error for ${symbol}:`, error.message);
      return null;
    }
  }

  async getPrices(symbols) {
    const prices = {};
    
    try {
      const krakenSymbols = symbols.map(s => this.getKrakenSymbol(s)).join(',');
      const response = await axios.get(`${BASE_URL}/Ticker`, {
        params: { pair: krakenSymbols },
        timeout: 5000
      });

      const data = response.data.result;
      
      symbols.forEach(symbol => {
        const krakenSymbol = this.getKrakenSymbol(symbol);
        const pairData = data[krakenSymbol] || data[Object.keys(data).find(k => k.includes(symbol.toUpperCase()))];
        
        if (pairData) {
          prices[symbol] = {
            provider: this.name,
            symbol,
            price: parseFloat(pairData.c[0]),
            timestamp: Date.now()
          };
        }
      });
    } catch (error) {
      console.error('Kraken API error:', error.message);
    }
    
    return prices;
  }

  async get24hStats(symbol) {
    try {
      const krakenSymbol = this.getKrakenSymbol(symbol);
      const response = await axios.get(`${BASE_URL}/Ticker`, {
        params: { pair: krakenSymbol },
        timeout: 5000
      });

      const data = response.data.result;
      const pairData = data[Object.keys(data)[0]];
      
      if (!pairData) return null;

      const currentPrice = parseFloat(pairData.c[0]);
      const openPrice = parseFloat(pairData.o);
      const change24h = ((currentPrice - openPrice) / openPrice) * 100;

      return {
        provider: this.name,
        symbol,
        price: currentPrice,
        change24h: change24h,
        volume24h: parseFloat(pairData.v[1]), // 24h volume
        high24h: parseFloat(pairData.h[1]), // 24h high
        low24h: parseFloat(pairData.l[1]), // 24h low
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Kraken 24h stats error for ${symbol}:`, error.message);
      return null;
    }
  }

  async getMarkets() {
    try {
      const response = await axios.get(`${BASE_URL}/AssetPairs`, {
        timeout: 5000
      });
      
      const markets = Object.entries(response.data.result)
        .filter(([_, pair]) => pair.quote === 'ZUSD' || pair.quote === 'USD')
        .slice(0, 50)
        .map(([symbol, pair]) => ({
          provider: this.name,
          baseAsset: pair.base,
          quoteAsset: pair.quote,
          symbol: symbol
        }));
      
      return markets;
    } catch (error) {
      console.error('Kraken markets error:', error.message);
      return [];
    }
  }

  async checkStatus() {
    try {
      const response = await axios.get(`${BASE_URL}/SystemStatus`, { 
        timeout: 3000 
      });
      this.isAvailable = response.data.result.status === 'online';
      return {
        provider: this.name,
        status: response.data.result.status,
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

export default new KrakenProvider();
