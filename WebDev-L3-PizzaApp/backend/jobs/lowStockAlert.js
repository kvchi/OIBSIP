import cron from "node-cron";
import Inventory from "../models/Inventory.js";
import sendEmail from "../utils/sendEmail.js";

const startLowStockJob = () => {
    cron.schedule("0 * * * *", async () => {
        const lowStockItems = await Inventory.find({
            $expr: { $lt: ["$stock", "$lowStockThreshold"] },
        });

        if (lowStockItems.length > 0) {
            console.log("Low stock alert for the following items:");
            lowStockItems.forEach((item) => {
                console.log(`- ${item.name}: ${item.stock} left (Threshold: ${item.lowStockThreshold})`);
            });

            const listHtml = lowStockItems
            .map((item) => `<li>${item.name}: ${item.stock} left (threshold: ${item.lowStockThreshold})</li>`)
            .join("");

            await sendEmail(
                process.env.ADMIN_EMAIL,
                "Low Stock Alert - Pizza Delivery App",
                `<p>The following items are running low:</p><ul>${listHtml}</ul>`
            );
        }
    });
       
    console.log("Low stock alert job started. Checking every minute.");
};
 
export default startLowStockJob;