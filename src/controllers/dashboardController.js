import Manifestation from "../models/Manifestation.js";
import Streak from "../models/Streak.js";
import Study from "../models/Study.js";
import Vault from "../models/Vault.js";
import Workspace from "../models/Workspace.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const workspaceId = req.user.workspaceId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* 🧘 Manifestations */
    const manifestationsToday = await Manifestation.countDocuments({
      user: userId,
      createdAt: { $gte: today },
    });

    const totalManifestations = await Manifestation.countDocuments({
      user: userId,
    });

    /* 📚 Study */
    const studyToday = await Study.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: "$minutes" },
        },
      },
    ]);

    const studyMinutesToday =
      studyToday.length > 0 ? studyToday[0].totalMinutes : 0;

    /* 🔐 Vault */
    const vaultItems = await Vault.countDocuments({
      user: userId,
    });

    /* 🔥 Streak */
    const streak = await Streak.findOne({ user: userId });

    /* 👥 Workspace */
    const workspace = await Workspace.findById(workspaceId);

    res.json({
      manifestationsToday,
      totalManifestations,
      studyMinutesToday,
      currentStreak: streak ? streak.current : 0,
      vaultItems,
      workspaceMembers: workspace ? workspace.members.length : 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};

