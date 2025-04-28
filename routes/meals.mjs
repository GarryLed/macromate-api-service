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
import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb to handle MongoDB IDs

const router = express.Router();
const mealsCollection = db.collection("meals");

// GET meals for a specific date 
router.get("/", async (req, res) => {
  const { date } = req.query;
  try {
    const meals = await mealsCollection.find({ date }).toArray();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

// POST a new meal log
router.post('/', async (req, res) => {
  const { date, mealType, foodItem } = req.body;

  if (!date || !mealType || !foodItem) {
    return res.status(400).json({ error: 'Missing meal entry fields.' });
  }

  try {
    const result = await mealsCollection.insertOne({
      date,
      mealType,
      foodItem,
      createdAt: new Date()
    });
    res.status(201).json({ message: 'Meal logged', result });
  } catch (err) {
    console.error('Error saving meal:', err);
    res.status(500).json({ error: 'Failed to save meal' });
  }
});

// DELETE a meal log
// This endpoint allows for deleting a meal item by its ID.

// DELETE /meals/:id - Delete a meal entry by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }
  

  try {
    const result = await mealsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Meal entry not found.' });
    }

    res.status(200).json({ message: 'Meal deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete meal:', err.stack || err.message || err);
    res.status(500).json({ error: 'Internal server error.' });
  }
  
});


export default router;
