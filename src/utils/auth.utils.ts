import { Response } from 'express';
import { Session } from '../interfaces/auth.interface';

export const getUserIdFromResponse = (res: Response): string => {
  if (!res.locals.session || !res.locals.session.id) {
    throw new Error('User ID not found in session');
  }
  return res.locals.session.id;
};