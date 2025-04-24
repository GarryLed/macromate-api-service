/**
 * Route for managing user nutrition goals (calories, macros, water).
 * 
 * GET /goals → Retrieves all saved goal entries (currently supports one shared goal).
 * 
 * POST /goals → Creates or updates the daily goal for calories, macros, and water intake.
 * 
 * This is used by the Goals page in MacroMate frontend  to configure user goals.
 */

import express from 'express';
import db from '../db/conn.mjs';

const router = express.Router();
const collection = db.collection('goals');

// POST /goals → Save or update current goals
router.post('/', async (req, res) => {
  const {
    calorieGoal,
    waterGoal,
    proteinPercent,
    carbsPercent,
    fatsPercent,
    startingWeight,
    targetWeight
  } = req.body;

  if (!calorieGoal || !waterGoal || !proteinPercent || !carbsPercent || !fatsPercent) {
    return res.status(400).json({ error: 'Missing required goal fields.' });
  }

  try {
    const result = await collection.updateOne(
      {}, // could add user id filter here down the road 
      {
        $set: {
          calorieGoal,
          waterGoal,
          proteinPercent,
          carbsPercent,
          fatsPercent,
          startingWeight,
          targetWeight,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    res.status(200).json({ message: 'Goals saved successfully.', result });
  } catch (err) {
    console.error('Failed to save goals:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /goals - > Fetch all goals
// Currently only supports one shared goal entry
router.get('/', async (_req, res) => {
  try {
    const goal = await collection.findOne({});
    res.status(200).json(goal);
  } catch (err) {
    console.error('Failed to fetch goals:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
