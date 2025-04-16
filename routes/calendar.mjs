/**
 * Route for retrieving and storing full daily summaries.
 * 
 * GET /calendar/:date → Retrieves a complete daily snapshot (meals, macros, water, weight).
 * 
 * POST /calendar → Saves or updates the entire day's summary.
 * 
 * 
 */

import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();
const collection = db.collection("calendar");

router.get("/:date", async (req, res) => {
  const { date } = req.params;
  try {
    const entry = await collection.findOne({ date });
    res.json(entry || {});
  } catch (err) {
    res.status(500).json({ error: "Failed to load calendar day" });
  }
});

// Save/update a calendar summary
router.post("/", async (req, res) => {
  const { date, ...dayData } = req.body;
  try {
    const result = await collection.updateOne(
      { date },
      { $set: { ...dayData, date } },
      { upsert: true }
    );
    res.json({ message: "Calendar day saved", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to save calendar day" });
  }
});

export default router;
