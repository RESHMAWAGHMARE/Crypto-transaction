const mongoose = require('mongoose');

const config = require('./config');

mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const Transaction = require('./models/Transaction'); // Move the require statement here
    const timestamp = new Date().toISOString();

    const transaction = new Transaction({
      hash: 'transactionHash',
      from: 'senderAddress',
      to: 'receiverAddress',
      value: '0.001',
      gasPrice: '1000000000',
      gasUsed: '21000',
      timestamp: timestamp // Set the timestamp field here
    });

    transaction.save()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.error(err);
      });
  })
  .catch(err => console.error(err));
