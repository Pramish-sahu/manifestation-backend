import express from "express";
import {
    getDocuments,
    uploadDocument,
} from "../controllers/studyDocumentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   📂 STUDY DOCUMENT ROUTES (WORKSPACE SHARED)
   Base: /api/study/documents
========================================================= */

/* 📤 UPLOAD DOCUMENT */
router.post("/", protect, uploadDocument);

/* 📥 GET DOCUMENTS (OPTIONAL CATEGORY FILTER) */
router.get("/", protect, getDocuments);

export default router;
