const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', true);
async function connect() {
  try {
    await mongoose.connect(process.env.BUILD_MODE === 'dev' ? process.env.MONGO_DB_CONNECT_DEV : process.env.MONGO_DB_CONNECT_PRODUCTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (process.env.BUILD_MODE === 'dev')
      console.log("Connected to MongoDB Local!")
    else
      console.log("Connected to MongoDB Cloud Atlas!")
  } catch (error) {
    console.log('DB connection error: ' + error);
  }
}
module.exports = { connect };
