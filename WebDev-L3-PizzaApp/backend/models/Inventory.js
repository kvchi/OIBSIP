import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        category: {
            type: String,
            enum: ["base", "sauce", "cheese", "vegetable"],
            required: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        lowStockThreshold: {
            type: Number,
            required: true,
            default: 10,
        },
    },
    { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
