import express from "express";
import {
    addStudyLog,
    getStudyLogs,
    getStudyStats,
} from "../controllers/studyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/log", protect, addStudyLog);
router.get("/", protect, getStudyLogs);
router.get("/stats", protect, getStudyStats);

export default router;
