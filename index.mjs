import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import goalsRoutes from "./routes/goals.mjs";

import foods from "./routes/foods.mjs";

dotenv.config(); // Load .env

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Mounting the foods routes
// This is where we will add the routes for the foods
app.use("/foods", foods);

// Mounting the goals routes
// This is where we will add the routes for the goals
app.use("/goals", goalsRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("An unexpected error occurred.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
