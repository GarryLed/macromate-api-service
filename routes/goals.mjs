/**
 * Route for managing user nutrition goals (calories, macros, water).
 * 
 * GET /goals => Retrieves the current saved goal entry.
 * 
 * POST /goals => Creates or updates the daily goal for calories, macros, and water intake.
 * 
 * This is used by the Goals page in MacroMate frontend to configure user goals.
 */

import express from 'express';
import db from '../db/conn.mjs';

const router = express.Router();
const collection = db.collection('goals');

// POST /goals => Save or update current goals
router.post('/', async (req, res) => {
  const {
    calorieGoal,
    waterGoal,
    proteinPercent,
    carbsPercent,
    fatsPercent,
  } = req.body;

  if (
    typeof calorieGoal !== 'number' ||
    typeof waterGoal !== 'number' ||
    typeof proteinPercent !== 'number' ||
    typeof carbsPercent !== 'number' ||
    typeof fatsPercent !== 'number'
  ) {
    return res.status(400).json({ error: 'All goal fields must be numbers and are required.' });
  }

  try {
    const result = await collection.updateOne(
      { userId: 'shared-user' }, // Placeholder for future multi-user support
      {
        $set: {
          calorieGoal,
          waterGoal,
          proteinPercent,
          carbsPercent,
          fatsPercent,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    res.status(200).json({ message: 'Nutrition goals saved successfully.', result });
  } catch (err) {
    console.error('Failed to save nutrition goals:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /goals => Fetch current goals
router.get('/', async (_req, res) => {
  try {
    const goal = await collection.findOne({ userId: 'shared-user' });
    if (!goal) {
      return res.status(404).json({ error: 'No nutrition goals found.' });
    }
    res.status(200).json(goal);
  } catch (err) {
    console.error('Failed to fetch goals:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
