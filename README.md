# Crypto Trading Bot

A simple trading bot that interacts with LCX and Binance exchanges to fetch market data and execute trading strategies.

## Features

- Fetches market data from LCX and Binance.
- Generates and places orders based on the best bid and ask prices.
- Manages open orders.
- Fetches account balances.

## Project Structure

- `exchange.js`: Contains methods to interact with the LCX exchange API.
- `binanceExchange.js`: Contains methods to interact with the Binance exchange API.
- `marketData.js`: Fetches market data from LCX and Binance.
- `orderManager.js`: Manages the placing and canceling of orders.
- `strategy.js`: Implements the trading strategy.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/crypto-trading-bot.git
   cd crypto-trading-bot
2. install dependencies:
   npm install
3. Run the Market Making Bot:
   node index.js