import axios from 'axios';

const API_BASE_URL = 'https://server-production-b58e.up.railway.app/';

export const priceService = {
  async getPrices(symbols) {
    const params = symbols ? { symbols: symbols.join(',') } : {};
    const response = await axios.get(`${API_BASE_URL}/prices`, { params });
    return response.data;
  },

  async getPriceBySymbol(symbol) {
    const response = await axios.get(`${API_BASE_URL}/prices/${symbol}`);
    return response.data;
  },

  async getProvidersStatus() {
    const response = await axios.get(`${API_BASE_URL}/providers/status`);
    return response.data;
  },

  async getExchangeQuote(from, to, amount) {
    const response = await axios.get(`${API_BASE_URL}/exchange/quote`, {
      params: { from, to, amount }
    });
    return response.data;
  },

  async comparePair(pair) {
    const response = await axios.get(`${API_BASE_URL}/exchange/compare/${pair}`);
    return response.data;
  },

  async getMarkets() {
    const response = await axios.get(`${API_BASE_URL}/markets`);
    return response.data;
  }
};
