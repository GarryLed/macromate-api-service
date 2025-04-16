/**
 *  Route for logging and retrieving user weight entries.
 * 
 * GET /weight or /weight?date=YYYY-MM-DD → Returns one or all weight logs.
 * 
 * POST /weight → Saves a new weight entry (includes unit and optional note).
 * 
 * Used for the Weight Progress chart and BMI tracking.
 */


import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();
const collection = db.collection("weight");

// GET all weight entries or filter by date
router.get("/", async (req, res) => {
  const { date } = req.query;
  const filter = date ? { date } : {};
  try {
    const entries = await collection.find(filter).toArray();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weight entries" });
  }
});

// POST new weight entry
router.post("/", async (req, res) => {
  const entry = req.body;
  try {
    const result = await collection.insertOne(entry);
    res.status(201).json({ message: "Weight logged", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to save weight entry" });
  }
});

export default router;
