
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/error.class';

// Generic validation middleware
export function validateRequest<T>(validator: (data: any) => { valid: boolean; errors: string[] }) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { valid, errors } = validator(req.body);
    
    if (!valid) {
      return next(new BadRequestError(`Validation error: ${errors.join(', ')}`));
    }
    
    next();
  };
}

// Validator for creating notes
export function validateNote(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.title) {
    errors.push('Title is required');
  } else if (data.title.length > 100) {
    errors.push('Title cannot be more than 100 characters');
  }
  
  if (!data.content) {
    errors.push('Content is required');
  }
  
  // categoryId is optional, so we don't check for its presence
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validator for updating notes
export function validateNoteUpdate(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.title !== undefined && data.title.length > 100) {
    errors.push('Title cannot be more than 100 characters');
  }
  
  // Other fields are optional with no specific validation constraints
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validator for creating users
export function validateUser(data: any): { valid: boolean; errors: string[] } { 
  const errors: string[] = [];
  
  if (!data.username) {
    errors.push('Username is required');
  } else if (data.username.length > 50) {
    errors.push('Username cannot be more than 50 characters');
  }
  
  if (!data.email) {
    errors.push('Email is required');
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.push('Email is not valid');
  }
  
  if (!data.password) {
    errors.push('Password is required');
  } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(data.password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validator for updating users
export function validateUserUpdate(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.username && data.username.length > 50) {
    errors.push('Username cannot be more than 50 characters');
  }
  
  if (data.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.push('Email is not valid');
  }
  
  if (data.password && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(data.password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
