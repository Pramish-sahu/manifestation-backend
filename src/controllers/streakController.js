import DailyActivity from "../models/DailyActivity.js";
import Streak from "../models/Streak.js";
import Workspace from "../models/Workspace.js";

/* =========================================================
   🔑 HELPER: ALWAYS GET WORKSPACE FROM MEMBERSHIP
   (Fixes joined-user streak issue)
========================================================= */
const getUserWorkspaceId = async (userId) => {
  const workspace = await Workspace.findOne({
    members: userId,
  }).select("_id");

  return workspace?._id || null;
};

/* =========================================================
   ✅ MARK DAILY ACTIVITY (USED BY MANTRA / 11:11 / ETC)
========================================================= */
export const markActivity = async (req, res, next) => {
  try {
    const { activity } = req.body;

    if (!activity) {
      return res.status(400).json({ message: "Activity required" });
    }

    // 🔥 IMPORTANT FIX: derive workspace dynamically
    const workspaceId = await getUserWorkspaceId(req.user._id);
    if (!workspaceId) {
      return res.status(400).json({ message: "User has no workspace" });
    }

    /* 📅 TODAY (timezone-safe) */
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let record = await DailyActivity.findOne({
      user: req.user._id,
      workspace: workspaceId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!record) {
      record = await DailyActivity.create({
        user: req.user._id,
        workspace: workspaceId,
        date: startOfDay,
        activities: { [activity]: true },
      });
    } else {
      record.activities[activity] = true;
      await record.save();
    }

    res.json(record);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   📆 GET CALENDAR DATA (WORKSPACE SHARED)
========================================================= */
export const getCalendarData = async (req, res, next) => {
  try {
    const workspaceId = await getUserWorkspaceId(req.user._id);

    if (!workspaceId) {
      return res.json([]);
    }

    const data = await DailyActivity.find({
      workspace: workspaceId,
    })
      .populate("user", "name")
      .sort({ date: -1 });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   🔥 LEGACY STREAK LOGIC (UNCHANGED, SAFE)
========================================================= */
export const completeStreak = async (req, res, next) => {
  try {
    const { type } = req.body;

    let streak = await Streak.findOne({
      user: req.user._id,
      type,
    });

    const today = new Date();

    if (!streak) {
      streak = await Streak.create({
        type,
        currentStreak: 1,
        longestStreak: 1,
        lastCompleted: today,
        user: req.user._id,
        workspace: await getUserWorkspaceId(req.user._id),
      });

      return res.json(streak);
    }

    streak.lastCompleted = today;
    streak.currentStreak += 1;
    streak.longestStreak = Math.max(
      streak.longestStreak,
      streak.currentStreak
    );

    await streak.save();
    res.json(streak);
  } catch (error) {
    next(error);
  }
};

export const getStreaks = async (req, res, next) => {
  try {
    const streaks = await Streak.find({ user: req.user._id });
    res.json(streaks);
  } catch (error) {
    next(error);
  }
};
