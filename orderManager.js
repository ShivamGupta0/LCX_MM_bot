// orderManager.js
class OrderManager {
    constructor() {
      this.boo = []; // Buy open orders
      this.soo = []; // Sell open orders
    }
  
    async placeOrders(orders) {
      for (const order of orders) {
        const { pair, side, quantity, price, postOnly } = order;
        console.log(`Simulated order placed: ${side} ${quantity} ${pair} at ${price} (PostOnly: ${postOnly})`);
        // const placedOrder = await this.exchange.createOrder(order);
      }
      // Return the orders that were "placed"
      return orders;
    }
  
    async cancelOrders(orders) {
      for (const order of orders) {
        const { pair, side, quantity, price, postOnly } = order;
        console.log(`Simulated order cancelled: ${side} ${quantity} ${pair} at ${price} (PostOnly: ${postOnly})`);
        //const canceledOrder = await this.exchange.cancelOrder(order.Id);
      }
    }
  
    async manageOrders(InternalBuyBook, InternalSellBook) {

      // Update the open orders from Trading API
      // const oo = await this.exchange.getOpenOrders()
      this.boo = [];
      this.soo = [];

      const min_diff = 5 //min_diff to not cancel similar order and replace 
      const createList = [];
      const cancelList = [];

      // Sort orders by price
      this.boo.sort((a, b) => b.price - a.price);
      this.soo.sort((a, b) => a.price - b.price);
  
      // Compare and prepare cancel and create lists for buy orders
      for (let i = 0; i < InternalBuyBook.length; i++) {
        const internalOrder = InternalBuyBook[i];
        const existingOrder = this.boo[i];
  
        if (existingOrder && 
            Math.abs(internalOrder.price - parseFloat(existingOrder.price)) <= min_diff &&
            Math.abs(internalOrder.quantity - parseFloat(existingOrder.quantity)) < 0.15 * parseFloat(existingOrder.quantity)) {
          continue;
        } else {
          if (existingOrder) {
            cancelList.push(existingOrder);
          }
          createList.push(internalOrder);
        }
      }
  
      // Compare and prepare cancel and create lists for sell orders
      for (let i = 0; i < InternalSellBook.length; i++) {
        const internalOrder = InternalSellBook[i];
        const existingOrder = this.soo[i];
  
        if (existingOrder && 
            Math.abs(internalOrder.price - parseFloat(existingOrder.price)) <= min_diff &&
            Math.abs(internalOrder.quantity - parseFloat(existingOrder.quantity)) < 0.15 * parseFloat(existingOrder.quantity)) {
          continue;
        } else {
          if (existingOrder) {
            cancelList.push(existingOrder);
          }
          createList.push(internalOrder);
        }
      }
  
      // Place and cancel orders
      await this.cancelOrders(cancelList);
      const placedOrders = await this.placeOrders(createList);
  
    }
  }
  
  module.exports = OrderManager;
  