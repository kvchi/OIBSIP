import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import startLowStockJob from "./jobs/lowStockAlert.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { initSocket } from "./utils/socket.js";

// Load environment variables from .env into process.env.
// This MUST run before connectDB() is called — otherwise
// process.env.MONGO_URI would be undefined.
dotenv.config();

// Connect to MongoDB
connectDB();
startLowStockJob();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL, 
    methods: ["GET", "POST"],
  },
});

initSocket(io); // Initialize socket.io and set the instance

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Allow requests from the frontend (different origin: localhost:5173)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// Simple test route to confirm the server is alive
app.get("/", (req, res) => {
  res.send("Pizza Delivery API is running");
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});