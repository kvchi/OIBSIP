import express from "express";
import { createInventoryItem, getInventoryItems, updateInventoryItem } from "../controllers/inventoryController.js";
import protect, { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createInventoryItem);
router.get("/", getInventoryItems);
router.patch("/:id", protect, isAdmin, updateInventoryItem);

export default router;