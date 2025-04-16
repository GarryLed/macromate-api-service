/**
 * Route for logging and retrieving water intake.
 * 
 * GET /water?date=YYYY-MM-DD → Fetches all water entries for a specific date.
 * 
 * POST /water → Adds a new water intake log (in milliliters).
 * 
 * Used to track daily hydration targets in MacroMate.
 */


import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();
const collection = db.collection("water");

// GET water intake by date
router.get("/", async (req, res) => {
  const { date } = req.query;
  try {
    const entries = await collection.find({ date }).toArray();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch water intake" });
  }
});

// POST new water intake
router.post("/", async (req, res) => {
  const waterEntry = req.body;
  try {
    const result = await collection.insertOne(waterEntry);
    res.status(201).json({ message: "Water log added", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to log water intake" });
  }
});

export default router;
