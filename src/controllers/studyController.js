import Study from "../models/Study.js";

/* =========================================================
   ADD / UPDATE TODAY'S STUDY LOG
   - One log per user per day per workspace
   - If already exists → update it
========================================================= */
export const addStudyLog = async (req, res, next) => {
  try {
    const { hours, topic, note } = req.body;

    if (!hours || hours <= 0 || !topic?.trim()) {
      return res.status(400).json({
        message: "Valid study hours and topic are required",
      });
    }

    if (!req.user?.workspaceId) {
      return res.status(400).json({
        message: "User is not part of any workspace",
      });
    }

    /* 📅 TODAY RANGE (00:00 → 23:59) */
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    /* 🔍 CHECK EXISTING TODAY LOG */
    const existingLog = await Study.findOne({
      user: req.user._id,
      workspace: req.user.workspaceId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingLog) {
      existingLog.hours = hours;
      existingLog.topic = topic.trim();
      existingLog.note = note?.trim() || "";

      await existingLog.save();

      return res.json({
        message: "Today's study log updated",
        study: existingLog,
      });
    }

    /* ➕ CREATE NEW LOG */
    const study = await Study.create({
      user: req.user._id,
      workspace: req.user.workspaceId,
      hours,
      topic: topic.trim(),
      note: note?.trim() || "",
    });

    res.status(201).json({
      message: "Study log added",
      study,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   GET WORKSPACE STUDY ACTIVITY
   - Used by StudyActivity screen
   - Shows name + hours + topic + date
========================================================= */
export const getStudyLogs = async (req, res, next) => {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({
        message: "User is not part of any workspace",
      });
    }

    const logs = await Study.find({
      workspace: req.user.workspaceId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(100); // safety for production

    res.json(logs);
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   GET WORKSPACE STUDY STATS
   - Used by StudyStats screen
========================================================= */
export const getStudyStats = async (req, res, next) => {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({
        message: "User is not part of any workspace",
      });
    }

    const logs = await Study.find({
      workspace: req.user.workspaceId,
    });

    const totalHours = logs.reduce(
      (sum, log) => sum + (log.hours || 0),
      0
    );

    res.json({
      totalHours,
      totalSessions: logs.length,
    });
  } catch (err) {
    next(err);
  }
};
