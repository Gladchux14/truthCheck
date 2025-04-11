// config/database.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/mydatabase';
    await mongoose.connect(dbUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ DB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;