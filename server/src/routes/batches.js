import { Router } from "express";
import Batch from "../models/Batch.js";
import { analyzeQuality } from "../utils/analyze.js";

const router = Router();
const stageNames = { 1: "Collection Centre", 2: "Dairy Processing", 3: "Distribution / Consumer" };

router.get("/", async (_req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.json(batches);
  } catch (e) { res.status(500).json({ message: "Could not load batches. Is MongoDB running?", detail: e.message }); }
});

router.get("/:batchId", async (req, res) => {
  try {
    const batch = await Batch.findOne({ batchId: req.params.batchId });
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    res.json(batch);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/analyze", (req, res) => {
  const result = analyzeQuality(req.body);
  res.json(result);
});

router.post("/", async (req, res) => {
  try {
    const result = analyzeQuality(req.body);
    const batchId = req.body.batchId || `MILK-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const reading = {
      stage: 1, stageName: stageNames[1], timestamp: new Date(),
      temperature: Number(req.body.temperature), ph: Number(req.body.ph), tds: Number(req.body.tds),
      conductivity: Number(req.body.conductivity), density: Number(req.body.density),
      colourValue: Number(req.body.colourValue), status: result.status,
      deviatedParameters: result.deviatedParameters, recommendation: result.recommendation
    };
    const batch = await Batch.create({
      batchId, farmerName: req.body.farmerName, farmerId: req.body.farmerId,
      collectionCentre: req.body.collectionCentre, collectionDate: req.body.collectionDate || new Date(),
      quantityLitres: Number(req.body.quantityLitres), currentStage: 1,
      readings: [reading], finalStatus: result.status
    });
    res.status(201).json({ batch, analysis: result });
  } catch (e) { res.status(400).json({ message: e.code === 11000 ? "Batch ID already exists" : e.message }); }
});

router.post("/:batchId/readings", async (req, res) => {
  try {
    const batch = await Batch.findOne({ batchId: req.params.batchId });
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    const stage = Number(req.body.stage);
    if (![2,3].includes(stage)) return res.status(400).json({ message: "Stage must be 2 or 3" });
    const result = analyzeQuality(req.body);
    const reading = {
      stage, stageName: stageNames[stage], timestamp: new Date(),
      temperature: Number(req.body.temperature), ph: Number(req.body.ph), tds: Number(req.body.tds),
      conductivity: Number(req.body.conductivity), density: Number(req.body.density),
      colourValue: Number(req.body.colourValue), status: result.status,
      deviatedParameters: result.deviatedParameters, recommendation: result.recommendation
    };
    batch.readings.push(reading);
    batch.currentStage = stage;
    batch.finalStatus = batch.readings.some(r => r.status === "HIGH DEVIATION") ? "HIGH DEVIATION"
      : batch.readings.some(r => r.status === "QUALITY DEVIATION") ? "QUALITY DEVIATION" : "NORMAL";
    await batch.save();
    res.json({ batch, analysis: result });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete("/:batchId", async (req, res) => {
  try {
    const deleted = await Batch.findOneAndDelete({ batchId: req.params.batchId });
    if (!deleted) return res.status(404).json({ message: "Batch not found" });
    res.json({ message: "Batch deleted" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
