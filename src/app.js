import cors from "cors";
import express from "express";
import protect from "./middleware/authMiddleware.js";
import errorHandler from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import manifestationRoutes from "./routes/manifestationRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import studyRoutes from "./routes/studyRoutes.js";
import vaultRoutes from "./routes/vaultRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

/* 🔓 PUBLIC ROUTES (NO TOKEN REQUIRED) */
app.use("/api/auth", authRoutes);

/* 🔐 PROTECTED ROUTES (TOKEN REQUIRED) */
app.use("/api/workspace", protect, workspaceRoutes);
app.use("/api/study", protect, studyRoutes);
app.use("/api/vault", protect, vaultRoutes);
app.use("/api/streak", protect, streakRoutes);
app.use("/api/manifestation", protect, manifestationRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("🚀 Manifestation Backend Running");
});

export default app;
