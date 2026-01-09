import DailyActivity from "../models/DailyActivity.js";
import Study from "../models/Study.js";

/* =========================================================
   ADD / UPDATE TODAY'S STUDY LOG
   (LOGIC UNCHANGED — ONLY STREAK SYNC ADDED)
========================================================= */
export const addStudyLog = async (req, res, next) => {
  try {
    const { hours, topic, note } = req.body;
    const parsedHours = Number(hours);

    if (!parsedHours || parsedHours <= 0 || !topic?.trim()) {
      return res.status(400).json({
        message: "Valid study hours and topic are required",
      });
    }

    if (!req.user?.workspaceId) {
      return res.status(400).json({
        message: "User is not part of any workspace",
      });
    }

    /* 📅 TODAY RANGE */
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    /* 🔍 CHECK EXISTING */
    const existingLog = await Study.findOne({
      user: req.user._id,
      workspace: req.user.workspaceId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingLog) {
      existingLog.hours = parsedHours;
      existingLog.topic = topic.trim();
      existingLog.note = note?.trim() || "";
      await existingLog.save();

      /* 🔥 SYNC STUDY → STREAK CALENDAR */
      await DailyActivity.updateOne(
        {
          user: req.user._id,
          workspace: req.user.workspaceId,
          date: startOfDay,
        },
        {
          $set: { "activities.study": true },
        },
        { upsert: true }
      );

      return res.json({
        success: true,
        message: "Today's study log updated",
        study: existingLog,
      });
    }

    /* ➕ CREATE NEW LOG */
    const study = await Study.create({
      user: req.user._id,
      workspace: req.user.workspaceId,
      hours: parsedHours,
      topic: topic.trim(),
      note: note?.trim() || "",
    });

    /* 🔥 SYNC STUDY → STREAK CALENDAR */
    await DailyActivity.updateOne(
      {
        user: req.user._id,
        workspace: req.user.workspaceId,
        date: startOfDay,
      },
      {
        $set: { "activities.study": true },
      },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Study log added",
      study,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET WORKSPACE STUDY ACTIVITY (UNCHANGED)
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
      .limit(100)
      .lean();

    res.json(logs);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET STUDY STATS (UNCHANGED)
========================================================= */
export const getStudyStats = async (req, res, next) => {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({
        message: "User is not part of any workspace",
      });
    }

    const logs = await Study.find(
      { workspace: req.user.workspaceId },
      { hours: 1 }
    ).lean();

    const totalHours = logs.reduce(
      (sum, log) => sum + (log.hours || 0),
      0
    );

    res.json({
      totalHours,
      totalSessions: logs.length,
    });
  } catch (error) {
    next(error);
  }
};
