/**
 * Route for retrieving and storing full daily summaries.
 * 
 * GET /calendar/:date => Retrieves a complete daily snapshot (meals, macros, water, weight).
 * 
 */

import express from 'express';
import db from '../db/conn.mjs';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Collections
const mealsCollection = db.collection('meals');
const weightsCollection = db.collection('weights');
const waterCollection = db.collection('water');

// GET /calendar/:date => Fetch daily summary (calories, macros, water, weight)
router.get('/:date', async (req, res) => {
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({ error: 'Date is required.' });
  }

  try {
    // === MEAL TOTALS ===
    const meals = await mealsCollection.find({ date }).toArray();

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const meal of meals) {
      totalCalories += meal.foodItem?.calories || 0;
      totalProtein += meal.foodItem?.protein || 0;
      totalCarbs += meal.foodItem?.carbs || 0;
      totalFat += meal.foodItem?.fat || 0;
    }

    // === WEIGHT ON THE DAY ===
    const weightEntry = await weightsCollection.findOne({ date });

    // === WATER TOTAL FOR THE DAY ===
    const waterLogs = await waterCollection.find({ date }).toArray();
    const totalWater = waterLogs.reduce((sum, entry) => sum + (entry.amount || 0), 0);

    // === RESPONSE ===
    res.status(200).json({
      totalCalories: Math.round(totalCalories * 10) / 10,
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      totalFat: Math.round(totalFat * 10) / 10,
      water: totalWater, // Total water intake in milliliters
      weight: weightEntry ? weightEntry.weight : 0
    });

  } catch (err) {
    console.error('Failed to load calendar summary:', err.stack || err.message || err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
