// routes/manifestationRoutes.js
import express from "express";
import {
    addManifestation,
    deleteManifestation,
    getManifestations,
    getTodayManifestations,
} from "../controllers/manifestationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addManifestation);
router.get("/", protect, getManifestations);
router.get("/today", protect, getTodayManifestations);
router.delete("/:id", protect, deleteManifestation);

export default router;
