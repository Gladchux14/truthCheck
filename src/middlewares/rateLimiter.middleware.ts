import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

export const factCheckLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many fact-check requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
}); 