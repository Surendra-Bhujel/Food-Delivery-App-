import express from "express";

import {
  createRestaurant,
  getMyRestaurant,
  getRestaurantById,
  getRestaurants,
  toggleRestaurant,
  updateRestaurant,
} from "../controllers/restaurantController.js";

import { protect, isOwner } from "../middleware/auth.js";

import { upload } from "../middleware/multer.js";

const router = express.Router();

// Public routes
router.get("/", getRestaurants);

router.get("/my-restaurant", protect, isOwner, getMyRestaurant);
router.get("/:id", getRestaurantById);
// Owner routes
router.post("/", protect, isOwner, upload.single("image"), createRestaurant);
router.put("/:id", protect, isOwner, upload.single("image"), updateRestaurant);
router.patch("/:id/toggle", protect, isOwner, toggleRestaurant);

export default router;
