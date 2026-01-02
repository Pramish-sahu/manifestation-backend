import Streak from "../models/Streak.js";

const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const isYesterday = (lastDate) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(lastDate, yesterday);
};

/**
 * @desc Mark streak completed for today
 * @route POST /api/streak/complete
 * @access Private
 */
export const completeStreak = async (req, res) => {
  const { type } = req.body;

  if (!type) {
    return res.status(400).json({ message: "Streak type required" });
  }

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

  if (streak.lastCompleted && isSameDay(streak.lastCompleted, today)) {
    return res.json(streak); // already completed today
  }

  if (streak.lastCompleted && isYesterday(streak.lastCompleted)) {
    streak.currentStreak += 1;
  } else {
    streak.currentStreak = 1;
  }

  streak.longestStreak = Math.max(
    streak.longestStreak,
    streak.currentStreak
  );

  streak.lastCompleted = today;
  await streak.save();

  res.json(streak);
};

/**
 * @desc Get all streaks
 * @route GET /api/streak
 * @access Private
 */
export const getStreaks = async (req, res) => {
  const streaks = await Streak.find({
    user: req.user._id,
  });

  res.json(streaks);
};
