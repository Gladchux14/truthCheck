
import { Request, Response, NextFunction } from 'express';

interface LoggingData {
  method: string;
  path: string;
  timestamp: Date;
  query: object;
  body?: object;
  userId?: string;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const loggingData: LoggingData = {
    method: req.method,
    path: req.path,
    timestamp: new Date(),
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined,
    userId: (req as any).user?._id // If you have authentication implemented
  };
  
  // Log the request data
  console.log(`[${loggingData.timestamp.toISOString()}] ${loggingData.method} ${loggingData.path}`);
  console.log('Request data:', JSON.stringify(loggingData, null, 2));
  
  // Capture response time
  const startTime = Date.now();
  
  // Listen for the response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Response: ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};
