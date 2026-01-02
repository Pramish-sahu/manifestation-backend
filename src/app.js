import cors from "cors";
import express from "express";
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

app.use("/api/auth", authRoutes);

app.use("/api/workspace", workspaceRoutes);

app.use("/api/study", studyRoutes);

app.use("/api/vault", vaultRoutes);

app.use("/api/streak", streakRoutes);

app.use("/api/manifestation", manifestationRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Manifestation Backend Running");
});

export default app;
