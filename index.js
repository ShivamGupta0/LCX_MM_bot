// index.js
const Strategy = require('./strategy');

const pair = 'ETH/EUR'; // only those symbols which are available both on LCX and Binance 
const maxPos = 5; // Example max position
const maxInventory = 10; // Example max inventory
const levels = 5; // Example number of levels
const levelBuffer = 0.0001; // Example level buffer
const strategy = new Strategy();

async function executeStrategyContinuously(pair,maxPos,maxInventory,levels,levelBuffer) {
  try {
    await strategy.execute(pair,maxPos,maxInventory,levels,levelBuffer);
    console.log('Loop completed, sleeping for 1 seconds...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep for 4 seconds
  } catch (error) {
    console.error('Exception occurred:', error.message);
  } finally {
    executeStrategyContinuously(pair,maxPos,maxInventory,levels,levelBuffer);
  }
}

executeStrategyContinuously(pair,maxPos,maxInventory,levels,levelBuffer);
