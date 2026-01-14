import express from 'express';
import * as itemController from '../controllers/itemController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createItemSchema, updateItemSchema } from '../types/schemas';

const router = express.Router();

/**
 * @route   GET /api/items
 * @desc    Get all items
 * @access  Public
 */
router.get('/', itemController.getAllItems);

/**
 * @route   GET /api/items/:id
 * @desc    Get item by ID
 * @access  Public
 */
router.get('/:id', itemController.getItemById);

/**
 * @route   POST /api/items
 * @desc    Create new item
 * @access  Private
 */
router.post(
  '/',
  authenticateToken,
  validateRequest(createItemSchema),
  itemController.createItem
);

/**
 * @route   PUT /api/items/:id
 * @desc    Update item
 * @access  Private
 */
router.put(
  '/:id',
  authenticateToken,
  validateRequest(updateItemSchema),
  itemController.updateItem
);

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete item
 * @access  Private
 */
router.delete('/:id', authenticateToken, itemController.deleteItem);

export default router;

