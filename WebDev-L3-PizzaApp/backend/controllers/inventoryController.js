import Inventory from "../models/Inventory.js";

//@route POST /api/inventory
export const createInventoryItem = async (req, res) => {
    const { category, name, price, stock, lowStockThreshold } = req.body || {};

    if (!category || !name || price === undefined ) {
        return res.status(400).json({ message: "Please provide category, name, and price" });
    }

    const item = await Inventory.create({ category, name, price, stock, lowStockThreshold });
    res.status(201).json({message: "Inventory item created successfully", item});
};

//@route GET /api/inventory
export const getInventoryItems = async (req, res) => {
    const items = await Inventory.find();
    res.status(200).json(items);
};
