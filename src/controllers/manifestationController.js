import Manifestation from "../models/Manifestation.js";

/* ================= ADD MANIFESTATION ================= */
export const addManifestation = async (req, res) => {
  try {
    const { text, category, isDaily } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const manifestation = await Manifestation.create({
      text,
      category,
      isDaily,
      user: req.user._id,
      workspace: req.user.workspaceId,
    });

    res.status(201).json(manifestation);
  } catch (error) {
    res.status(500).json({ message: "Failed to add manifestation" });
  }
};

/* ================= GET MANIFESTATIONS ================= */
export const getManifestations = async (req, res) => {
  try {
    const manifestations = await Manifestation.find({
      workspace: req.user.workspaceId,
    })
      .populate("user", "name username")
      .sort({ createdAt: -1 });

    res.json(manifestations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch manifestations" });
  }
};

/* ================= DELETE MANIFESTATION ================= */
export const deleteManifestation = async (req, res) => {
  try {
    const manifestation = await Manifestation.findById(req.params.id);

    if (!manifestation) {
      return res.status(404).json({ message: "Not found" });
    }

    if (manifestation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await manifestation.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
