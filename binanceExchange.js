// binanceExchange.js
const axios = require('axios');

class BinanceExchange {
  constructor() {
    this.baseUrl = 'https://api.binance.com/api/v3';
  }

  async getMarketData(symbol) {
    const endpoint = '/ticker/bookTicker';
    const params = { symbol };

    const config = {
      method: 'get',
      url: `${this.baseUrl}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      },
      params
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Error fetching market data from Binance:', error.response ? error.response.data : error.message);
    }
  }
}

module.exports = BinanceExchange;
