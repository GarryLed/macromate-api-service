import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();
const collection = db.collection("goals");

// GET all goals (only one user for now)
router.get("/", async (req, res) => {
  try {
    const goals = await collection.find({}).toArray();
    res.status(200).json(goals);
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// POST a new goal or update an existing one (basic single-user logic)
router.post("/", async (req, res) => {
  const { calories, proteinPercent, carbsPercent, fatsPercent, waterTarget } = req.body;

  if (!calories || !proteinPercent || !carbsPercent || !fatsPercent || !waterTarget) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Update logic: single goal for now
    const result = await collection.updateOne(
      {}, 
      {
        $set: {
          calories,
          proteinPercent,
          carbsPercent,
          fatsPercent,
          waterTarget
        }
      },
      { upsert: true }
    );

    res.status(200).json({ message: "Goal saved successfully", result });
  } catch (error) {
    console.error("Failed to save goal:", error);
    res.status(500).json({ error: "Failed to save goal" });
  }
});

export default router;

