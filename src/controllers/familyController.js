import FamilyItem from "../models/FamilyItem.js";

/* =========================================================
   ADD FAMILY NOTE OR DOCUMENT
   POST /api/family
   - type: "note" | "document"
   - shared inside workspace
========================================================= */
export const addFamilyItem = async (req, res, next) => {
  try {
    const { type, title, content, fileUrl } = req.body;

    /* 🔒 BASIC VALIDATION */
    if (!type || !title?.trim()) {
      return res.status(400).json({
        message: "Type and title are required",
      });
    }

    if (!["note", "document"].includes(type)) {
      return res.status(400).json({
        message: "Invalid family item type",
      });
    }

    if (!req.user?.workspaceId) {
      return res.status(400).json({
        message: "User is not part of any workspace",
      });
    }

    /* 📄 CREATE FAMILY ITEM */
    const item = await FamilyItem.create({
      type,
      title: title.trim(),
      content: type === "note" ? content?.trim() || "" : "",
      fileUrl: type === "document" ? fileUrl || "" : "",
      addedBy: req.user._id,
      workspace: req.user.workspaceId,
    });

    res.status(201).json({
      message: "Family item added successfully",
      item,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET FAMILY ITEMS (WORKSPACE SHARED)
   GET /api/family
========================================================= */
export const getFamilyItems = async (req, res, next) => {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({
        message: "User is not part of any workspace",
      });
    }

    const items = await FamilyItem.find({
      workspace: req.user.workspaceId,
    })
      .populate("addedBy", "name username")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    next(error);
  }
};
