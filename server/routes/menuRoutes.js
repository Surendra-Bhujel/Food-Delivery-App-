import express from 'express';
import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItem,
  getMenuByRestaurant,
} from '../controllers/menuController.js';

import { protect, isOwner } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/restaurant/:restaurantId', getMenuByRestaurant);

// Protected routes (Owner only)
router.post('/', protect, isOwner, addMenuItem);
router.put('/:id', protect, isOwner, updateMenuItem);
router.delete('/:id', protect, isOwner, deleteMenuItem);
router.patch('/:id/toggle', protect, isOwner, toggleMenuItem);

export default router;