import { NextFunction, Request, Response, Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { requestLogger } from '../middlewares/logging.middleware';

const router = Router();

// Register route
router.post('/register', requestLogger, registerUser);

// Login route
router.post('/login', requestLogger, loginUser);

export default router;