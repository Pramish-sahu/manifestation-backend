import DailyActivity from "../models/DailyActivity.js";

/* 🗓️ GET TODAY (00:00) */
const todayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * POST /api/activity/mark
 * body: { type: "study" | "mantra" | "wish1111" | "manifestation" }
 */
export const markDailyActivity = async (req, res, next) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Activity type required" });
    }

    const date = todayDate();

    let activity = await DailyActivity.findOne({
      user: req.user._id,
      date,
    });

    if (!activity) {
      activity = await DailyActivity.create({
        user: req.user._id,
        workspace: req.user.workspaceId,
        date,
        activities: { [type]: true },
      });
    } else {
      activity.activities[type] = true;
      await activity.save();
    }

    res.json(activity);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/activity/today
 */
export const getTodayActivities = async (req, res, next) => {
  try {
    const date = todayDate();

    const activities = await DailyActivity.find({
      workspace: req.user.workspaceId,
      date,
    }).populate("user", "name");

    res.json(activities);
  } catch (error) {
    next(error);
  }
};
