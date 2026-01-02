import express from "express";
import {
    createWorkspace,
    getWorkspaceMembers,
    joinWorkspace,
} from "../controllers/workspaceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createWorkspace);
router.post("/join", protect, joinWorkspace);
router.get("/members", protect, getWorkspaceMembers);

export default router;
