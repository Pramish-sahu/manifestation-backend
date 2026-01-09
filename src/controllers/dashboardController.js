import DailyActivity from "../models/DailyActivity.js";
import Manifestation from "../models/Manifestation.js";
import Streak from "../models/Streak.js";
import Workspace from "../models/Workspace.js";
import User from "../models/userModel.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const workspaceId = req.user.workspaceId;

    if (!workspaceId) {
      return res.status(400).json({
        message: "User is not part of any workspace",
      });
    }

    /* 🕒 TODAY (00:00) */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* 👤 CURRENT USER */
    const user = await User.findById(userId).select("name");

    /* 👥 WORKSPACE + MEMBERS */
    const workspace = await Workspace.findById(workspaceId).populate({
      path: "members",
      select: "name",
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isCreator =
      workspace.members[0]._id.toString() === userId.toString();

    /* 🧘 TODAY'S MANIFESTATIONS */
    const todayManifestations = await Manifestation.find({
      workspace: workspaceId,
      createdAt: { $gte: today },
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    /* 📊 TODAY'S DAILY ACTIVITIES (STUDY / MANTRA / WISH) */
    const dailyActivities = await DailyActivity.find({
      workspace: workspaceId,
      date: today,
    }).populate("user", "name");

    /* 🔥 STREAK */
    const streak = await Streak.findOne({
      user: userId,
    });

    /* 📤 RESPONSE */
    res.json({
      user: {
        id: user._id,
        name: user.name,
        isCreator,
      },

      workspace: {
        id: workspace._id,
        type: workspace.type,
        creatorName: workspace.members[0].name,
        members: workspace.members.map((m) => m.name),
      },

      /* 🟣 MANIFESTATIONS */
      todayManifestations: todayManifestations.map((m) => ({
        id: m._id,
        author: m.user.name,
        points: m.points || 1,
        createdAt: m.createdAt,
      })),

      /* 🔵 STUDY / 🟢 RITUAL / ✨ WISH */
      dailyActivities: dailyActivities.map((a) => ({
        user: {
          id: a.user._id,
          name: a.user.name,
        },
        activities: a.activities,
      })),

      /* 🔥 STREAK */
      currentStreak: streak ? streak.currentStreak : 0,
    });
  } catch (error) {
    console.error("🔥 Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
