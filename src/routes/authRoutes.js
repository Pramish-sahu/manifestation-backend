import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

/* ✅ REGISTER (PUBLIC) */
router.post("/register", registerUser);

/* ✅ LOGIN (PUBLIC) */
router.post("/login", loginUser);

export default router;
