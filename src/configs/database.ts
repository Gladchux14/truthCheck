// config/db.js
import mongoose from 'mongoose';
import config from "../configs/config";

export const connectDB = () => {
  const mongoUri = process.env.MONGO_URI as string;
  if (!mongoUri) {
    throw new Error("Mongo URI is missing")
  }
    console.log("Connecting to DB")
    mongoose.set('strictQuery', true)
    mongoose.connect(mongoUri, {

    }).then(() => {
        console.log("Connected to DB")
    }).catch((err) => {
      console.log(err)
        console.log("Error connecting to DB")
    });
    }