const Exchange = require('./exchange');
const BinanceExchange = require('./binanceExchange');

class MarketData {
  constructor(apiKey, apiSecret) {
    this.exchange = new Exchange(apiKey, apiSecret);
    this.binanceExchange = new BinanceExchange();
  }

  async getOrderBook(pair) {
    const marketDataFull = await this.exchange.getMarketData(pair);
    if (marketDataFull && marketDataFull.data) {
      let marketData = marketDataFull.data;

      if (marketData.buy && marketData.buy.length > 0 && marketData.sell && marketData.sell.length > 0) {
        const bestBid = parseFloat(marketData.buy[0][0]);
        const bestAsk = parseFloat(marketData.sell[0][0]);

        return { bestBid, bestAsk };
      } else {
        throw new Error('Order book data is incomplete or empty');
      }
    } else {
      throw new Error('Unable to fetch market data from LCX');
    }
  }

  async getBinanceOrderBook(pair) {
    const symbol = pair.replace('/', ''); // Remove '/' from pair
    const marketData = await this.binanceExchange.getMarketData(symbol);
    if (marketData) {
      const bestBid = parseFloat(marketData.bidPrice);
      const bestAsk = parseFloat(marketData.askPrice);

      return { bestBid, bestAsk };
    } else {
      throw new Error('Unable to fetch market data from Binance');
    }
  }
}

module.exports = MarketData;
