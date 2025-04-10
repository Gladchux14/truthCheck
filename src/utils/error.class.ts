export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
      super(message, 404);
    }
  }
  
export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
      super(message, 400);
    }
  }

export class ForbiddenError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  
  constructor(message: string) {
    super(message);
    this.statusCode = 403;
    this.status = 'fail';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}