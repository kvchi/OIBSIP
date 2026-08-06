import cron from "node-cron";
import Inventory from "../models/Inventory.js";

const startLowStockJob = () => {
    cron.schedule("* * * * *", async () => {
        const lowStockItems = await Inventory.find({
            $expr: { $lt: ["$stock", "$lowStockThreshold"] },
        });

        if (lowStockItems.length > 0) {
            console.log("Low stock alert for the following items:");
            lowStockItems.forEach((item) => {
                console.log(`- ${item.name}: ${item.stock} left (Threshold: ${item.lowStockThreshold})`);
            });
        }
    });
       
    console.log("Low stock alert job started. Checking every minute.");
};
 
export default startLowStockJob;