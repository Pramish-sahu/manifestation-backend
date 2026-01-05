import express from "express";
import {
    createWorkspace,
    getInviteCode,
    getWorkspaceMembers,
    joinWorkspace,
} from "../controllers/workspaceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createWorkspace);
router.post("/join", protect, joinWorkspace);
router.get("/members", protect, getWorkspaceMembers);
router.get("/invite", protect, getInviteCode); // ✅ ADD

export default router;
