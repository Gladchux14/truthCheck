import express, { Express } from 'express';
import mongoose from 'mongoose';
import connectDB from './server';
import dotenv from 'dotenv';
// import userRoutes from './routes/userRoutes';
// import errorHandler from './middleware/errorHandler';
//import {createClient} from 'redis';

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 3000;



// Middlewar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/users', userRoutes);

// Error Handling Middlewar
// app.use(errorHandler);

// Initialise Redis Client
/*const redisClient = createClient({
    url: 'redis://localhost:6379'
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
(async () => {
    await redisClient.connect();
})();*/
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//export default app;