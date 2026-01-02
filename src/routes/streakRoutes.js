import express from "express";
import {
    completeStreak,
    getStreaks,
} from "../controllers/streakController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/complete", protect, completeStreak);
router.get("/", protect, getStreaks);

export default router;
