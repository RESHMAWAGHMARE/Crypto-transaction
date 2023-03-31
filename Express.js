const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');

const app = express();

mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error(err));

app.get('/users/:address', async (req, res) => {
  const address = req.params.address;

  // Get all transactions where the user's address is the "to" or "from" address
  const transactions = await Transaction.find({ $or: [{ to: address }, { from: address }] });

  let balance = 0;
  for (const transaction of transactions) {
    if (transaction.to === address) {
      balance += parseFloat(transaction.value);
    } else {
      balance -= parseFloat(transaction.value);
    }
  }

  // Get the current price of Ethereum in INR
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
  const data = await response.json();
  const price = data.ethereum.inr;

  res.json({
    address: address,
    balance: balance,
    price: price
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
