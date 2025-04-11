import express, { Express } from 'express';
import dotenv from 'dotenv';
import verifyRoutes from './src/routes/verify.routes';
// import errorHandler from './middleware/errorHandler';
//import {createClient} from 'redis';

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 3000;



// Middlewar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/verify', verifyRoutes);

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



export default app;