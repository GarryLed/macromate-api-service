/**
 *  Route for logging and retrieving user weight entries.
 * 
 * GET /weight or /weight?date=YYYY-MM-DD → Returns one or all weight logs.
 * 
 * POST /weight → Saves a new weight entry (includes unit and optional note).
 * 
 * Used for the Weight Progress chart and BMI tracking.
 */


import express from 'express';
import db from '../db/conn.mjs'; 
import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb to handle MongoDB IDs

const router = express.Router();
const collection = db.collection('weights');

// POST /weights - Add a new weight log
router.post('/', async (req, res) => {
  const { weight, date } = req.body;

  if (!weight || !date) {
    return res.status(400).json({ error: 'Weight and date are required.' });
  }

  try {
    const result = await collection.insertOne({ weight, date, createdAt: new Date() });
    res.status(201).json(result);
  } catch (err) {
    console.error('Failed to save weight log:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /weights - Fetch all weight logs
router.get('/', async (_req, res) => {
  try {
    const weights = await collection.find({}).sort({ date: -1 }).toArray();
    res.status(200).json(weights);
  } catch (err) {
    console.error('Failed to fetch weight logs:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /weights/:id - Delete a weight entry
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required.' });
  }

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Weight entry not found.' });
    }

    res.status(200).json({ message: 'Weight entry deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete weight entry:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
