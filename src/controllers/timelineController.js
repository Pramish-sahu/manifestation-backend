import Manifestation from "../models/Manifestation.js";
import Streak from "../models/Streak.js";
import Study from "../models/Study.js";
import Vault from "../models/Vault.js";

/**
 * @desc   Get unified activity timeline
 * @route  GET /api/timeline
 * @access Private
 */
export const getTimeline = async (req, res, next) => {
  try {
    const workspace = req.user.workspaceId;

    /* 📘 STUDY */
    const studies = await Study.find({ workspace })
      .populate("user", "name")
      .select("hours topic createdAt user")
      .lean();

    const studyLogs = studies.map((s) => ({
      user: s.user.name,
      action: `studied ${s.hours} hours (${s.topic})`,
      type: "study",
      time: s.createdAt,
    }));

    /* 🔐 VAULT */
    const vaults = await Vault.find({ workspace })
      .populate("user", "name")
      .select("title createdAt user")
      .lean();

    const vaultLogs = vaults.map((v) => ({
      user: v.user.name,
      action: `added a password (${v.title})`,
      type: "vault",
      time: v.createdAt,
    }));

    /* ✨ MANIFESTATION */
    const manifestations = await Manifestation.find({ workspace })
      .populate("user", "name")
      .select("createdAt user")
      .lean();

    const manifestationLogs = manifestations.map((m) => ({
      user: m.user.name,
      action: "wrote today’s manifestation",
      type: "manifestation",
      time: m.createdAt,
    }));

    /* 🕉️ STREAK / RITUAL */
    const streaks = await Streak.find({ workspace })
      .populate("user", "name")
      .select("type createdAt user")
      .lean();

    const streakLogs = streaks.map((s) => ({
      user: s.user.name,
      action:
        s.type === "mantra"
          ? "listened to night mantra"
          : s.type === "ritual"
          ? "completed a ritual"
          : "completed a streak",
      type: "ritual",
      time: s.createdAt,
    }));

    /* 🧠 MERGE & SORT */
    const timeline = [
      ...studyLogs,
      ...vaultLogs,
      ...manifestationLogs,
      ...streakLogs,
    ].sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json(timeline.slice(0, 100)); // safety limit
  } catch (err) {
    next(err);
  }
};
