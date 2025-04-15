import express, { Application, Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import verifyRoutes from './routes/verify.routes';
import factCheckRoutes from './routes/factCheck.routes';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './configs/swagger';
import { errorHandler } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/logging.middleware';
import { NotFoundError } from './utils/error.class';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.route';

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 3000;

// The Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for Swagger documentation route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Truth Checker API Docs',
}));

// Mount routes directly
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/verify', verifyRoutes);
app.use('/api/v1/fact-check', factCheckRoutes);

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError(`Cannot find ${req.originalUrl} on this server`));
});

// Request logger
app.use(requestLogger);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;
