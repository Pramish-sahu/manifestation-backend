import express from "express";
import {
    getTodayActivities,
    markDailyActivity,
} from "../controllers/dailyActivityController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/mark", protect, markDailyActivity);
router.get("/today", protect, getTodayActivities);

export default router;
