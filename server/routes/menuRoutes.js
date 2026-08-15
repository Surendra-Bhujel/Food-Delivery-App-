import express from "express";

import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItem,
  getMenuByRestaurant,
} from "../controllers/menuController.js";

import { protect, isOwner } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC
router.get("/restaurant/:restaurantId", getMenuByRestaurant);
// Owner
router.post("/", protect, isOwner, addMenuItem);
router.put("/:id", protect, isOwner, updateMenuItem);
router.delete("/:id", protect, isOwner, deleteMenuItem);
router.patch("/:id/toggle", protect, isOwner, toggleMenuItem);

export default router;
