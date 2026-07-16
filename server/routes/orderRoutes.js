import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getRestaurantOrders,
  confirmOrder,
  assignRider,
  updateOrderStatus,
  getAvailableRiders,
} from '../controllers/orderController.js';

import { protect, isOwner, isRider } from '../middleware/auth.js';

const router = express.Router();

router.post('/checkout', protect, createOrder);           // Create new order
router.get('/mine', protect, getMyOrders);                // Get my orders
router.get('/:id', protect, getOrderById);                // Get single order

router.get('/restaurant/:restaurantId', protect, isOwner, getRestaurantOrders);
router.put('/:id/confirm', protect, isOwner, confirmOrder);
router.put('/:id/assign-rider', protect, isOwner, assignRider);
router.get('/available-riders', protect, isOwner, getAvailableRiders);

router.put('/:id/status', protect, isRider, updateOrderStatus);

export default router;