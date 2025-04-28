/**
 * Route for retrieving and storing full daily summaries.
 * 
 * GET /calendar/:date=> Retrieves a complete daily snapshot (meals, macros, water, weight).
 * 
 * POST /calendar => Saves or updates the entire day's summary.
 * 
 * 
 */

import express from 'express';
import db from '../db/conn.mjs';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Collections
const mealsCollection = db.collection('meals');
const weightsCollection = db.collection('weights');

// GET /calendar/:date => Fetch daily summary (calories, macros, water, weight)
router.get('/:date', async (req, res) => {
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({ error: 'Date is required.' });
  }

  try {
    // Fetch all meals logged for the selected date
    const meals = await mealsCollection.find({ date: date }).toArray();

    // Initialize totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    // Sum all macros from the meals for a given date (this has a bug where it is accumulating the macros for all meals, not just the ones for the date)
    for (const meal of meals) {
      totalCalories += meal.foodItem?.calories || 0;
      totalProtein += meal.foodItem?.protein || 0;
      totalCarbs += meal.foodItem?.carbs || 0;
      totalFat += meal.foodItem?.fat || 0;
    }

    // Fetch the weight logged for that date
    const weightEntry = await weightsCollection.findOne({ date: date });

   
    const waterIntake = 0; // Placeholder value (to be replaced with actual water intake logic)

    // Respond with the summary
    res.status(200).json({
      totalCalories: Math.round(totalCalories * 10) / 10,
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      totalFat: Math.round(totalFat * 10) / 10,
      water: waterIntake,
      weight: weightEntry ? weightEntry.weight : 0
    });

  } catch (err) {
    console.error('Failed to load calendar summary:', err.stack || err.message || err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
