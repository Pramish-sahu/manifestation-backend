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

    /* 🕒 TODAY START */
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

    /* 🧘 TODAY'S MANIFESTATIONS (WORKSPACE SHARED) */
    const todayManifestations = await Manifestation.find({
      workspace: workspaceId,
      createdAt: { $gte: today },
    })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    /* 🔥 STREAK (WORKSPACE LEVEL) */
    const streak = await Streak.findOne({ workspace: workspaceId });

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

      todayManifestations: todayManifestations.map((m) => ({
        id: m._id,
        points: m.points, // ✅ POINT-WISE
        author: m.user.name,
        createdAt: m.createdAt,
      })),

      currentStreak: streak ? streak.currentStreak : 0,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
