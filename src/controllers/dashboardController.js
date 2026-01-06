import Manifestation from "../models/Manifestation.js";
import Streak from "../models/Streak.js";
import Workspace from "../models/Workspace.js";
import User from "../models/userModel.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const workspaceId = req.user.workspaceId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* 👤 Current User */
    const user = await User.findById(userId).select("name");

    /* 👥 Workspace */
    const workspace = await Workspace.findById(workspaceId).populate({
      path: "members",
      select: "name",
    });

    /* 🧘 Today’s Manifestations (WORKSPACE BASED) */
    const todayManifestations = await Manifestation.find({
      workspace: workspaceId,
      createdAt: { $gte: today },
    })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(3);

    /* 🔥 Streak */
    const streak = await Streak.findOne({ workspace: workspaceId });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        isCreator: workspace.members[0]._id.toString() === userId.toString(),
      },
      workspace: {
        type: workspace.type,
        members: workspace.members,
        creatorName: workspace.members[0].name,
      },
      summary: todayManifestations.map((m) => ({
        text: m.text,
        author: m.user.name,
      })),
      currentStreak: streak ? streak.currentStreak : 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
