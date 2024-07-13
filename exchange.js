const axios = require('axios');
const CryptoJS = require('crypto-js');

class Exchange {
  constructor(apiKey, apiSecret) {
    this.baseUrl = 'https://exchange-api.lcx.com/api';
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async getMarketData(pair) {
    const endpoint = '/book';
    const params = { pair };

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
      console.error('Error fetching market data:', error.response ? error.response.data : error.message);
    }
  }

  async getPairDetails(pair) {
    const endpoint = '/pair';
    const params = { pair };

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
      console.error('Error fetching pair details:', error.response ? error.response.data : error.message);
    }
  }

  getHeaders(method, endpoint, payload) {
    const requestString = method + endpoint + JSON.stringify(payload);
    const hash = CryptoJS.HmacSHA256(requestString, this.apiSecret);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    return {
      'Content-Type': 'application/json',
      'x-access-key': this.apiKey,
      'x-access-sign': signature,
      'x-access-timestamp': Date.now()
    };
  }

  async createOrder(order) {
    const endpoint = '/create';
    const url = `${this.baseUrl}${endpoint}`;
    const method = 'POST';
    const headers = this.getHeaders(method, endpoint, order);

    try {
      const response = await axios.post(url, order, { headers });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error.response ? error.response.data : error.message);
    }
  }

  async cancelOrder(orderId) {
    const endpoint = '/cancel';
    const url = `${this.baseUrl}${endpoint}`;
    const method = 'DELETE';
    const params = { orderId };
    const headers = this.getHeaders(method, endpoint, {});

    try {
      const response = await axios.delete(url, { headers, params });
      return response.data;
    } catch (error) {
      console.error('Error canceling order:', error.response ? error.response.data : error.message);
    }
  }

  async getBalances() {
    const endpoint = '/balances';
    const url = `${this.baseUrl}${endpoint}`;
    const method = 'GET';
    const headers = this.getHeaders(method, endpoint, {});

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching balances:', error.response ? error.response.data : error.message);
    }
  }

  async getOpenOrders(pair, offset = 1) {
    const endpoint = '/open';
    const params = { pair, offset };
    const url = `${this.baseUrl}${endpoint}`;
    const method = 'GET';
    const headers = this.getHeaders(method, endpoint, {});

    try {
      const response = await axios.get(url, { headers, params });
      return response.data;
    } catch (error) {
      console.error('Error fetching open orders:', error.response ? error.response.data : error.message);
    }
  }
}

module.exports = Exchange;
