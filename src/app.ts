import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './configs/swagger';
import { errorHandler } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/logging.middleware';
import { NotFoundError } from './utils/error.class';
// import userRoutes from './routes/userRoutes';


const app: Application = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Truth Checker API Docs',
  }));

// Routes
// app.use('/api/users', userRoutes);

// Handle undefined routes
app.all('', (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError(`Cannot find ${req.originalUrl} on this server`));
  });
  

// Request logger
app.use(requestLogger);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;