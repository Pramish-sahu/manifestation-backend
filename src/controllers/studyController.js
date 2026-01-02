import Study from "../models/Study.js";

/**
 * @desc   Add study log
 * @route  POST /api/study/log
 * @access Private
 */
export const addStudyLog = async (req, res) => {
  try {
    const { hours, topic, note } = req.body;

    if (!hours || !topic) {
      return res
        .status(400)
        .json({ message: "Hours and topic are required" });
    }

    if (!req.user.workspaceId) {
      return res
        .status(400)
        .json({ message: "User not part of any workspace" });
    }

    const study = await Study.create({
      user: req.user._id,
      workspace: req.user.workspaceId,
      hours,
      topic,
      note,
    });

    res.status(201).json(study);
  } catch (error) {
    res.status(500).json({ message: "Failed to add study log" });
  }
};

/**
 * @desc   Get all study logs (workspace)
 * @route  GET /api/study
 * @access Private
 */
export const getStudyLogs = async (req, res) => {
  try {
    if (!req.user.workspaceId) {
      return res
        .status(400)
        .json({ message: "User not part of any workspace" });
    }

    const logs = await Study.find({
      workspace: req.user.workspaceId,
    })
      .populate("user", "name username")
      .sort({ date: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch study logs" });
  }
};

/**
 * @desc   Get study stats
 * @route  GET /api/study/stats
 * @access Private
 */
export const getStudyStats = async (req, res) => {
  try {
    if (!req.user.workspaceId) {
      return res
        .status(400)
        .json({ message: "User not part of any workspace" });
    }

    const logs = await Study.find({
      workspace: req.user.workspaceId,
    });

    const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);
    const totalSessions = logs.length;

    res.json({
      totalHours,
      totalSessions,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
