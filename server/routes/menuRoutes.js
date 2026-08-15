import express from "express";

import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItem,
  getMenuByRestaurant,
  getMenuItemById,
} from "../controllers/menuController.js";

import { protect, isOwner } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// Public
router.get("/restaurant/:restaurantId", getMenuByRestaurant);

// Owner
router.post("/", protect, isOwner, upload.single("image"), addMenuItem);
router.put("/:id", protect, isOwner, upload.single("image"), updateMenuItem);
router.delete("/:id", protect, isOwner, deleteMenuItem);
router.patch("/:id/toggle", protect, isOwner, toggleMenuItem);
router.get("/:id", getMenuItemById);

export default router;
