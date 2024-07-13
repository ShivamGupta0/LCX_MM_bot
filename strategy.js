// strategy.js
const MarketData = require('./marketData');
const OrderManager = require('./orderManager');
const Exchange = require('./exchange');

class Strategy {
  constructor() {
    this.marketData = new MarketData();
    this.orderManager = new OrderManager();
    this.exchange = new Exchange()
    this.pairDetails = null;
  }

  async generateOrders(pair, bestBid, bestAsk, binanceBestBid, binanceBestAsk,maxPos,maxInventory,levels,levelBuffer) {
    // Constants as per the pair
    const pairData = this.pairDetails.data;
    const minOrderSize = pairData.MinOrder.Base;
    const tick = Math.pow(10, -pairData.Orderprecision.Price);
    const qtyAccuracy = pairData.Orderprecision.Amount;
    const accuracy = pairData.Orderprecision.Price;
  
    // Calculate position using Account API 
    // const balances = await this.exchange.getBalances()
    const baseSymbolBalance = 3; // Example base symbol balance
    const quoteSymbolBalance = 350000; // Example quote symbol balance
    const totalProf = 0.02; // Example maximum total profit
  
    const mid = (binanceBestBid + binanceBestAsk) / 2; // Mid price from Binance

    const position = Math.min(
      Math.max(0, (baseSymbolBalance) / (maxInventory)),
      1
    );
  
    // Calculate spreads
    const baseSymbolSpread =(totalProf) * position;
    const quoteSymbolSpread =(totalProf) * (1 - position);
  
    // Calculate quantities
    let buyQty = 0;
    if (baseSymbolBalance < maxInventory) {
      buyQty = Math.min(
        maxPos,
        (quoteSymbolBalance) / mid,
        maxInventory - baseSymbolBalance
      );
    }
  
    let sellQty = Math.min(maxPos, baseSymbolBalance);
  
    // Control flags
    let buyFlag = buyQty >= minOrderSize * levels;
    let sellFlag = sellQty >= minOrderSize * levels;
  
    // Calculate prices
    const buyPrice = mid * (1 - baseSymbolSpread);
    const sellPrice = mid * (1 + quoteSymbolSpread);
  
    // Generate orders
    const internalBuyOrders = [];
    const internalSellOrders = [];

    if (buyFlag) {
      for (let level = 0; level < levels; level++) {
        let levelPrice = Math.min(buyPrice - level * levelBuffer * mid, bestAsk - tick);
        let postOnly = true;

        internalBuyOrders.push({
          pair,
          side: 'buy',
          quantity: parseFloat((buyQty / levels).toFixed(qtyAccuracy)),
          price: parseFloat(levelPrice.toFixed(accuracy)),
          postOnly
        });
      }
    }
  
    if (sellFlag) {
      for (let level = 0; level < levels; level++) {
        let levelPrice = Math.max(sellPrice + level * levelBuffer * mid, bestBid + tick);
        let postOnly = true;
        
        internalSellOrders.push({
          pair,
          side: 'sell',
          quantity: parseFloat((sellQty / levels).toFixed(qtyAccuracy)),
          price: parseFloat(levelPrice.toFixed(accuracy)),
          postOnly
        });
      }
    }
  
    // Send orders to OrderManager
    await this.orderManager.manageOrders(internalBuyOrders,internalSellOrders);
  
    return { buyPrice, sellPrice };
  }
  

  async execute(pair,maxPos,maxInventory,levels,levelBuffer) {
    try {
      if (!this.pairDetails) {
          this.pairDetails = await this.exchange.getPairDetails(pair);
          }
      const { bestBid, bestAsk } = await this.marketData.getOrderBook(pair);
      const { bestBid: binanceBestBid, bestAsk: binanceBestAsk } = await this.marketData.getBinanceOrderBook(pair);
      
    //   console.log(binanceBestBid,binanceBestAsk)
      if (bestBid && bestAsk && binanceBestBid && binanceBestAsk) {
        const result = await this.generateOrders(pair, bestBid, bestAsk, binanceBestBid, binanceBestAsk,maxPos,maxInventory,levels,levelBuffer);
        // console.log(`Orders generated for ${pair}:`, result);
      }
    } catch (error) {
      console.error('Error executing strategy:', error.message);
    }
  }
}

module.exports = Strategy;
