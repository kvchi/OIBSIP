import express from "express";
import { createInventoryItem, getInventoryItems } from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/", createInventoryItem);
router.get("/", getInventoryItems);

export default router;