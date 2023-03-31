// ethereumPriceFetcher.js


import mongoose from 'mongoose';
import fetch from 'node-fetch';
import config from './config.js';
import Transaction from './models/Transaction.js';

async function fetchPrice() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
  const json = await response.json();
  return json.ethereum.usd;
}

mongoose.connect(config.mongoUri, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
    setInterval(async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const data = await response.json();
        const price = data.ethereum.inr;
        const timestamp = new Date().toISOString();

        const transaction = new Transaction({
          hash: 'transactionHash',
          from: 'senderAddress',
          to: 'receiverAddress',
          value: price,
          gasPrice: '1000000000',
          gasUsed: '21000',
          timestamp: timestamp
        });

        const result = await transaction.save();
        console.log(`Saved transaction with value ${price}`);
      } catch (err) {
        console.error(err);
      }
    }, 600000); // Run every 10 minutes
  })
  .catch(err => console.error(err));

export default fetchPrice;
