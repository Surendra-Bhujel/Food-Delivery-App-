import express from 'express';
import {
  createRestaurant,
  getRestaurantById,
  getRestaurants,
  toggleRestaurant,
  updateRestaurant,
} from '../controllers/restaurantController.js';

import { protect, isOwner } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// Protected routes (Owner only)
router.post('/', protect, isOwner, createRestaurant);
router.put('/:id', protect, isOwner, updateRestaurant);
router.patch('/:id/toggle', protect, isOwner, toggleRestaurant);

export default router;