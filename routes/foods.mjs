/**
 *  Route for searching food items using the Edamam Food Database API.
 * 
 * GET /foods?q=searchTerm → Fetches matching food items, including:
 *  - Name
 *  - Nutrition info (calories, protein, carbs, fat)
 *  - Serving size
 *  - Image
 * 
 * This acts as a backend proxy to protect Edamam API keys and clean response data
 * before sending it to the frontend.
 */

/**

 */

import express from "express";
import axios from "axios";

const router = express.Router();

const appId = process.env.EDAMAM_APP_ID;
const appKey = process.env.EDAMAM_APP_KEY;

router.get("/", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const edamamURL = "https://api.edamam.com/api/food-database/v2/parser";

    const response = await axios.get(edamamURL, {
      params: {
        app_id: appId,
        app_key: appKey,
        ingr: query
      }
    });

    const results = response.data.hints.map((hint) => {
      const food = hint.food;
      return {
        label: food.label,
        calories: food.nutrients.ENERC_KCAL || 0,
        protein: food.nutrients.PROCNT || 0,
        carbs: food.nutrients.CHOCDF || 0,
        fat: food.nutrients.FAT || 0,
        servingSize: food.servingSizes?.[0]
          ? `${food.servingSizes[0].quantity} ${food.servingSizes[0].label}`
          : "100g",
        image: food.image || ""
      };
    });

    res.json(results);
  } catch (error) {
    console.error("Edamam API error:", error.message);
    res.status(500).json({ error: "Failed to fetch food data" });
  }
});

export default router;

