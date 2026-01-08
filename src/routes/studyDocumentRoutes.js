import express from "express";
import {
    getDocuments,
    uploadDocument,
} from "../controllers/studyDocumentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, uploadDocument);
router.get("/", protect, getDocuments);

export default router;
