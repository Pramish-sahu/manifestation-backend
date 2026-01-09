import cors from "cors";
import express from "express";

import errorHandler from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import familyRoutes from "./routes/familyRoutes.js"; // ✅ ADD THIS
import manifestationRoutes from "./routes/manifestationRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import studyDocumentRoutes from "./routes/studyDocumentRoutes.js";
import studyRoutes from "./routes/studyRoutes.js";
import vaultRoutes from "./routes/vaultRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

/* 🔓 PUBLIC */
app.use("/api/auth", authRoutes);

/* 🔐 PROTECTED */
app.use("/api/workspace", workspaceRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/study/documents", studyDocumentRoutes);
app.use("/api/family", familyRoutes); // ✅ ADD THIS
app.use("/api/vault", vaultRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/manifestation", manifestationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("🚀 Manifestation Backend Running");
});

export default app;
