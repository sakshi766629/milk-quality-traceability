import mongoose from "mongoose";

const readingSchema = new mongoose.Schema({
  stage: { type: Number, min: 1, max: 3, required: true },
  stageName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  temperature: Number,
  ph: Number,
  tds: Number,
  conductivity: Number,
  density: Number,
  colourValue: Number,
  status: { type: String, enum: ["NORMAL", "QUALITY DEVIATION", "HIGH DEVIATION"], default: "NORMAL" },
  deviatedParameters: [String],
  recommendation: String
}, { _id: false });

const batchSchema = new mongoose.Schema({
  batchId: { type: String, unique: true, required: true },
  farmerName: { type: String, required: true },
  farmerId: { type: String, required: true },
  collectionCentre: { type: String, required: true },
  collectionDate: { type: Date, default: Date.now },
  quantityLitres: { type: Number, required: true },
  currentStage: { type: Number, default: 1 },
  readings: [readingSchema],
  finalStatus: { type: String, enum: ["NORMAL", "QUALITY DEVIATION", "HIGH DEVIATION"], default: "NORMAL" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Batch", batchSchema);
