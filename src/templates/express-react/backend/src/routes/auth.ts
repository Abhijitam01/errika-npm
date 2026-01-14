import express from 'express';
import * as authController from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { loginSchema, registerSchema } from '../types/schemas';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRequest(registerSchema), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', validateRequest(loginSchema), authController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authController.getCurrentUser);

export default router;

