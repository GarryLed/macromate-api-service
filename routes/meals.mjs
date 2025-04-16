/**
 * Route for logging and retrieving daily meals.
 * 
 * GET /meals?date=YYYY-MM-DD → Fetches all meals for a specific date.
 * 
 * POST /meals → Adds a new meal log (e.g., Breakfast, Lunch) to the database.
 * 
 * Each meal log includes food items, meal type, and nutrition totals.
 */

import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();
const collection = db.collection("meals");

// GET meals for a specific date 
router.get("/", async (req, res) => {
  const { date } = req.query;
  try {
    const meals = await collection.find({ date }).toArray();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

// POST a new meal log
router.post("/", async (req, res) => {
  const mealLog = req.body;
  try {
    const result = await collection.insertOne(mealLog);
    res.status(201).json({ message: "Meal added", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to add meal" });
  }
});

export default router;
