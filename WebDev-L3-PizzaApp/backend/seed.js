import mongoose from "mongoose";
import dotenv from "dotenv";
import Inventory from "./models/inventory.js";

dotenv.config();

const items = [
  // Bases
  { category: "base", name: "Thin Crust", price: 400, stock: 50, lowStockThreshold: 10 },
  { category: "base", name: "Thick Crust", price: 450, stock: 50, lowStockThreshold: 10 },
  { category: "base", name: "Cheese Burst", price: 500, stock: 50, lowStockThreshold: 10 },
  { category: "base", name: "Gluten Free", price: 550, stock: 50, lowStockThreshold: 10 },
  { category: "base", name: "Stuffed Crust", price: 600, stock: 50, lowStockThreshold: 10 },
  
  //Sauces
  { category: "sauce", name: "Tomato Sauce", price: 100, stock: 60, lowStockThreshold: 10 },
  { category: "sauce", name: "BBQ Sauce", price: 150, stock: 50, lowStockThreshold: 10 },
  { category: "sauce", name: "Pesto", price: 180, stock: 30, lowStockThreshold: 8 },
  { category: "sauce", name: "White Garlic Sauce", price: 170, stock: 30, lowStockThreshold: 8 },
  { category: "sauce", name: "Peri Peri Sauce", price: 160, stock: 30, lowStockThreshold: 8 },


  // Cheeses
  { category: "cheese", name: "Mozzarella", price: 300, stock: 60, lowStockThreshold: 15 },
  { category: "cheese", name: "Cheddar", price: 320, stock: 40, lowStockThreshold: 10 },
  { category: "cheese", name: "Parmesan", price: 350, stock: 30, lowStockThreshold: 8 },
  { category: "cheese", name: "Vegan Cheese", price: 380, stock: 20, lowStockThreshold: 5 },

  // Vegetables
  { category: "vegetable", name: "Mushrooms", price: 100, stock: 40, lowStockThreshold: 10 },
  { category: "vegetable", name: "Bell Peppers", price: 90, stock: 40, lowStockThreshold: 10 },
  { category: "vegetable", name: "Onions", price: 70, stock: 50, lowStockThreshold: 10 },
  { category: "vegetable", name: "Olives", price: 110, stock: 30, lowStockThreshold: 8 },
  { category: "vegetable", name: "Sweetcorn", price: 80, stock: 40, lowStockThreshold: 10 },
  { category: "vegetable", name: "Jalapenos", price: 90, stock: 30, lowStockThreshold: 8 },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        for (const item of items) {
            const exists = await Inventory.findOne({ name: item.name });
            if (exists) {
                console.log(`Skipping (already exists): ${item.name}`);
                continue;   
            }
            await Inventory.create(item);
            console.log(`Created: ${item.name}`);
            }

            console.log("Seeding completed");
    } catch (err) {
        console.error("Error seeding data:", err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

seed();