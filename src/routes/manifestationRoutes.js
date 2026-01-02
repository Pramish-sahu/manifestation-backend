import express from "express";
import {
    addManifestation,
    deleteManifestation,
    getManifestations,
} from "../controllers/manifestationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addManifestation);
router.get("/", protect, getManifestations);
router.delete("/:id", protect, deleteManifestation);

export default router;
