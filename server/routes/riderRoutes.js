import express from "express";
import {
  getMyDeliveries,
  getDeliveryHistory,
  toggleAvailability,
  updateLocation,
  getLatestLocation,
} from "../controllers/riderController.js";

import { protect, isRider } from "../middleware/auth.js";

const router = express.Router();

router.get("/my-deliveries", protect, isRider, getMyDeliveries);
router.get("/history", protect, isRider, getDeliveryHistory);
router.patch("/availability", protect, isRider, toggleAvailability);
router.post("/location", protect, isRider, updateLocation);
router.get("/location/:orderId", protect, getLatestLocation);

export default router;
