import express from "express";
import { loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

// router.post("/register", (req, res) => {
//   res.json({ ok: true });
// });

router.post("/login", loginUser);

export default router;
