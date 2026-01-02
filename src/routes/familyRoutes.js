import express from "express";
import {
    addFamilyItem,
    getFamilyItems,
} from "../controllers/familyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addFamilyItem);
router.get("/", protect, getFamilyItems);

export default router;
