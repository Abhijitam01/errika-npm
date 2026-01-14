import express from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only in production)
 * @access  Private
 */
router.get('/', authenticateToken, userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private
 */
router.put('/:id', authenticateToken, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private
 */
router.delete('/:id', authenticateToken, userController.deleteUser);

export default router;

