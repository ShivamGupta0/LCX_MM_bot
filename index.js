// index.js
const Strategy = require('./strategy');

const pair = 'BTC/EUR'; // only those symbols which are available both on LCX and Binance 
const maxPos = 5; // Example max position
const maxInventory = 10; // Example max inventory
const levels = 5; // Example number of levels
const levelBuffer = 0.0001; // Example level buffer
const strategy = new Strategy();

async function executeStrategyContinuously(pair, maxPos, maxInventory, levels, levelBuffer) {
  try {
    const startTime = new Date(); // Record start time
    await strategy.execute(pair, maxPos, maxInventory, levels, levelBuffer);
    const endTime = new Date(); // Record end time
    const timeTaken = (endTime - startTime) / 1000; // Calculate time taken in seconds

    console.log(`Loop completed in ${timeTaken} seconds, sleeping for 1 second...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep for 1 second
  } catch (error) {
    console.error('Exception occurred:', error.message);
  } finally {
    executeStrategyContinuously(pair, maxPos, maxInventory, levels, levelBuffer);
  }
}

executeStrategyContinuously(pair, maxPos, maxInventory, levels, levelBuffer);
