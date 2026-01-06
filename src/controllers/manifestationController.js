import Manifestation from "../models/Manifestation.js";

/* ======================================================
   ADD MANIFESTATION (POINT-WISE)
   POST /api/manifestation
   Access: Private
====================================================== */
export const addManifestation = async (req, res) => {
  try {
    const { points, category = "general", isDaily = true } = req.body;

    // ✅ Validation
    if (!points || !Array.isArray(points) || points.length === 0) {
      return res.status(400).json({
        message: "Manifestation points are required",
      });
    }

    // Remove empty points
    const cleanedPoints = points
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (cleanedPoints.length === 0) {
      return res.status(400).json({
        message: "Manifestation points cannot be empty",
      });
    }

    // ✅ Create manifestation
    const manifestation = await Manifestation.create({
      points: cleanedPoints,
      category,
      isDaily,
      user: req.user._id,
      workspace: req.user.workspaceId,
    });

    res.status(201).json(manifestation);
  } catch (error) {
    console.error("Add Manifestation Error:", error);
    res.status(500).json({
      message: "Failed to add manifestation",
    });
  }
};

/* ======================================================
   GET ALL MANIFESTATIONS (WORKSPACE SHARED)
   GET /api/manifestation
   Access: Private
====================================================== */
export const getManifestations = async (req, res) => {
  try {
    const manifestations = await Manifestation.find({
      workspace: req.user.workspaceId,
    })
      .populate("user", "name username")
      .sort({ createdAt: -1 });

    res.json(manifestations);
  } catch (error) {
    console.error("Get Manifestations Error:", error);
    res.status(500).json({
      message: "Failed to fetch manifestations",
    });
  }
};

/* ======================================================
   GET TODAY'S MANIFESTATIONS (FOR HOME PAGE)
   GET /api/manifestation/today
   Access: Private
====================================================== */
export const getTodayManifestations = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const manifestations = await Manifestation.find({
      workspace: req.user.workspaceId,
      createdAt: { $gte: today },
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(
      manifestations.map((m) => ({
        id: m._id,
        points: m.points,
        author: m.user.name,
        createdAt: m.createdAt,
      }))
    );
  } catch (error) {
    console.error("Today Manifestations Error:", error);
    res.status(500).json({
      message: "Failed to fetch today's manifestations",
    });
  }
};

/* ======================================================
   DELETE MANIFESTATION (OWNER ONLY)
   DELETE /api/manifestation/:id
   Access: Private
====================================================== */
export const deleteManifestation = async (req, res) => {
  try {
    const manifestation = await Manifestation.findById(req.params.id);

    if (!manifestation) {
      return res.status(404).json({
        message: "Manifestation not found",
      });
    }

    // ✅ Only creator can delete
    if (manifestation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this manifestation",
      });
    }

    await manifestation.deleteOne();

    res.json({
      message: "Manifestation deleted successfully",
    });
  } catch (error) {
    console.error("Delete Manifestation Error:", error);
    res.status(500).json({
      message: "Failed to delete manifestation",
    });
  }
};
