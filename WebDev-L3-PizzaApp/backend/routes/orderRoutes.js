import express from "express";
import { createOrder, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";
import protect, { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.patch("/:id/status", protect, isAdmin, updateOrderStatus);

export default router;