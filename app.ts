import express, { Express } from 'express';
// import userRoutes from './routes/userRoutes';
// import errorHandler from './middleware/errorHandler';

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/users', userRoutes);

// Error Handling Middleware
// app.use(errorHandler);

export default app;