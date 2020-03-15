const mongoose = require("mongoose");
const config = require('../config/database');

mongoose.connect(config.database, {useNewUrlParser: true});

mongoose.connection.on('connected', () => {
  console.log('Connected to database mongodb')
});

mongoose.connection.on('error', (err) => {
  if (err) {
    console.log('Error in database connection' + err)
  }
});
