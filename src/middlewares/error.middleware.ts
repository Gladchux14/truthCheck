import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error.class';
import mongoose from 'mongoose';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: messages
    });
  }

  // Handle Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate field value entered',
      field: Object.keys((err as any).keyValue)[0]
    });
  }

  // For unexpected errors
  console.error('ERROR DETAILS:', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};