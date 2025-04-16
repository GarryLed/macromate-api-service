import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes for the application
import goalsRoutes from "./routes/goals.mjs";
import mealsRoutes from "./routes/meals.mjs";
import waterRoutes from "./routes/water.mjs";
import calendarRoutes from "./routes/calendar.mjs";
import weightRoutes from "./routes/weight.mjs";


import "express-async-errors";

import foodsRoutes from "./routes/foods.mjs";

dotenv.config(); // Load .env

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());


app.use("/foods", foodsRoutes);

// Mounting the routes
// This is where we will add the routes for the goals, meals, water, calendar, and weight
app.use("/goals", goalsRoutes);
app.use("/meals", mealsRoutes);
app.use("/water", waterRoutes);
app.use("/calendar", calendarRoutes);
app.use("/weight", weightRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("An unexpected error occurred.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
