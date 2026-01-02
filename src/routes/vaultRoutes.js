import express from "express";
import {
    addVaultItem,
    deleteVaultItem,
    getVaultItems,
} from "../controllers/vaultController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addVaultItem);
router.get("/", protect, getVaultItems);
router.delete("/:id", protect, deleteVaultItem);

export default router;
