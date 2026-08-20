import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

// Import Routes (ES Modules)
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import riderRoutes from './routes/riderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("public/uploads"));
app.use("/", express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/rider', riderRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Client joins their personal user room (for order:new, order:assigned notifications)
  socket.on("join_user_room", (userId) => {
    if (!userId) return;
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user_${userId}`);
  });

  // Client (customer, owner, or rider) joins a specific order's room for live tracking
  socket.on("join_order_room", (orderId) => {
    if (!orderId) return;
    socket.join(`order_${orderId}`);
    console.log(`Socket ${socket.id} joined order_${orderId}`);
  });

  // Client leaves an order's room (e.g. navigating away from tracking page)
  socket.on("leave_order_room", (orderId) => {
    if (!orderId) return;
    socket.leave(`order_${orderId}`);
    console.log(`Socket ${socket.id} left order_${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });