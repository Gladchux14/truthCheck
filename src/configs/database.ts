import mongoose from 'mongoose';


export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI as string;
  if (!mongoUri) {
    throw new Error("Mongo URI is missing");
  }

  console.log("Connecting to DB...");
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
      family: 4, 
      authSource: 'admin', 
      retryWrites: true,
      w: 'majority'
    });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }

  
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (err) {
      console.error('Error during MongoDB disconnection:', err);
      process.exit(1);
    }
  });
};