import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

/* 🔓 REGISTER */
router.post("/register", async (req, res) => {
  await registerUser(req, res);
});

/* 🔓 LOGIN */
router.post("/login", async (req, res) => {
  await loginUser(req, res);
});

export default router;
