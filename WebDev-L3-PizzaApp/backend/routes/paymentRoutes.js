import express from "express";
import { createRazorpayOrder, verifyPayment } from "../controllers/paymentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a Razorpay order
router.post("/create-razorpay-order", protect, createRazorpayOrder);
// Route to verify the payment
router.post("/verify-payment", protect, verifyPayment);

export default router;