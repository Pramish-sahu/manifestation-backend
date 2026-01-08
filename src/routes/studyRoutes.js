import express from "express";
import {
    addStudyLog,
    getStudyLogs,
    getStudyStats,
} from "../controllers/studyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   📌 STUDY ROUTES (WORKSPACE SHARED)
   Base: /api/study
========================================================= */

/* ➕ ADD / UPDATE TODAY'S STUDY LOG */
router.post("/log", protect, addStudyLog);

/* 📊 GET WORKSPACE STUDY STATS */
router.get("/stats", protect, getStudyStats);

/* 📋 GET WORKSPACE STUDY ACTIVITY */
router.get("/", protect, getStudyLogs);

export default router;
