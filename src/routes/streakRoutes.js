import express from "express";
import {
    completeStreak,
    getCalendarData,
    getStreaks,
    markActivity,
} from "../controllers/streakController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ✅ NEW ROUTES */
router.post("/mark", protect, markActivity);
router.get("/calendar", protect, getCalendarData);

/* 🔁 OLD ROUTES (KEEP) */
router.post("/complete", protect, completeStreak);
router.get("/", protect, getStreaks);

export default router;
