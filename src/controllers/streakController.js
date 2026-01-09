import DailyActivity from "../models/DailyActivity.js";
import Streak from "../models/Streak.js";
import Workspace from "../models/Workspace.js";

/* ================= HELPER ================= */
const getUserWorkspaceId = async (userId) => {
  const workspace = await Workspace.findOne({
    members: userId,
  }).select("_id");

  return workspace?._id || null;
};

/* ================= MARK DAILY ACTIVITY ================= */
export const markActivity = async (req, res, next) => {
  try {
    const { activity } = req.body;
    if (!activity) {
      return res.status(400).json({ message: "Activity required" });
    }

    // 🔑 ALWAYS DERIVE WORKSPACE (FIX)
    const workspaceId = await getUserWorkspaceId(req.user._id);
    if (!workspaceId) {
      return res.status(400).json({ message: "User has no workspace" });
    }

    // ✅ DAY RANGE (timezone safe)
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    let record = await DailyActivity.findOne({
      user: req.user._id,
      workspace: workspaceId,
      date: { $gte: start, $lte: end },
    });

    if (!record) {
      record = await DailyActivity.create({
        user: req.user._id,
        workspace: workspaceId,
        date: start,
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

/* ================= CALENDAR DATA ================= */
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

/* ================= OLD STREAK LOGIC (UNCHANGED) ================= */
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
