import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import batchRoutes from "./routes/batches.js";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "Milk Quality Traceability API" }));
app.use("/api/batches", batchRoutes);

const port = process.env.PORT || 5000;
try {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/milk_quality_traceability");
  console.log("MongoDB connected");
} catch (err) {
  console.error("MongoDB connection failed:", err.message);
  console.error("Start MongoDB and check server/.env. API server will still start, but database routes will fail.");
}
app.listen(port, () => console.log(`API running at http://localhost:${port}`));
