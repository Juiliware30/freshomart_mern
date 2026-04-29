import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/connectDB.js";
import { connectCloudinary } from "./config/cloudinary.js";

import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import paymentRoutes from "./routes/payment.routes.js";


const app = express();

// Connect to services BEFORE starting the server
(async () => {
  try {
    await connectDB();
    await connectCloudinary();
    console.log("Connected to DB & Cloudinary");
  } catch (error) {
    console.error("Failed to initialize services:", error);
    // Removed process.exit(1) to prevent crashing on Vercel
  }
})();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" })); // supports base64 images

// Static Files
app.use("/images", express.static("uploads"));

// Root Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/payment", paymentRoutes);


// Server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
}

export default app;
