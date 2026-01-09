import DailyActivity from "../models/DailyActivity.js";
import Streak from "../models/Streak.js";

/* ================= MARK DAILY ACTIVITY ================= */
export const markActivity = async (req, res, next) => {
  try {
    const { activity } = req.body;

    if (!activity) {
      return res.status(400).json({ message: "Activity required" });
    }

    // ✅ TIMEZONE SAFE DAY RANGE
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    let record = await DailyActivity.findOne({
      user: req.user._id,
      workspace: req.user.workspaceId,
      date: { $gte: start, $lte: end },
    });

    if (!record) {
      record = await DailyActivity.create({
        user: req.user._id,
        workspace: req.user.workspaceId,
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
    const data = await DailyActivity.find({
      workspace: req.user.workspaceId,
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
        workspace: req.user.workspaceId,
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
