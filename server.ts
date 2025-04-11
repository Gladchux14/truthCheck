//require('dotenv').config();
//const app = require('./app');
//const connectDB = require('./config/db');
import dotenv from 'dotenv';
import app from './app';  // Import express app


dotenv.config();
import connectDB from './src/config/database';  // Import DB connection function

const PORT = process.env.PORT || 3000;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});


