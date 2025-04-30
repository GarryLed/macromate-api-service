/**
 * Route for logging and retrieving water intake.
 * 
 * GET /water?date=YYYY-MM-DD → Fetches all water entries for a specific date.
 * 
 * POST /water → Adds a new water intake log (in milliliters).
 * 
 * Used to track daily hydration targets in MacroMate.
 */


import express from 'express';
import db from '../db/conn.mjs';

const router = express.Router();
const collection = db.collection('water');

// POST /water - Add a new water log
router.post('/', async (req, res) => {
  const { date, amount } = req.body;
  if (!date || !amount) return res.status(400).json({ error: 'Missing fields.' });

  try {
    await collection.insertOne({ date, amount, createdAt: new Date() });
    res.status(201).json({ message: 'Water logged.' });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Internal error.' });
  }
});

// GET /water - Fetch all water logs for a specific date
router.get('/:date', async (req, res) => {
  const { date } = req.params;
  const results = await collection.find({ date }).toArray();
  res.json(results);
});

// GET /water/total/:date - Fetch total water intake for a specific date
router.get('/total/:date', async (req, res) => {
  const { date } = req.params;

  const sum = await collection.aggregate([
    { $match: { date } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]).toArray();

  res.json({ total: sum[0]?.total || 0 });
});

export default router;
