import Study from "../models/Study.js";

/* ADD STUDY LOG */
export const addStudyLog = async (req, res, next) => {
  try {
    const { hours, topic, note } = req.body;

    if (!hours || !topic) {
      return res.status(400).json({ message: "Hours and topic required" });
    }

    const study = await Study.create({
      user: req.user._id,
      workspace: req.user.workspaceId,
      hours,
      topic,
      note,
    });

    res.status(201).json(study);
  } catch (err) {
    next(err);
  }
};

/* GET WORKSPACE LOGS */
export const getStudyLogs = async (req, res, next) => {
  try {
    const logs = await Study.find({
      workspace: req.user.workspaceId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    next(err);
  }
};

/* GET WORKSPACE STATS */
export const getStudyStats = async (req, res, next) => {
  try {
    const logs = await Study.find({
      workspace: req.user.workspaceId,
    });

    const totalHours = logs.reduce((a, b) => a + b.hours, 0);

    res.json({
      totalHours,
      totalSessions: logs.length,
    });
  } catch (err) {
    next(err);
  }
};
