import FamilyItem from "../models/FamilyItem.js";

/**
 * @desc   Add family note or document
 * @route  POST /api/family
 * @access Private
 */
export const addFamilyItem = async (req, res, next) => {
  try {
    const { type, title, content, fileUrl } = req.body;

    if (!type || !title) {
      return res
        .status(400)
        .json({ message: "Type and title are required" });
    }

    const item = await FamilyItem.create({
      type,
      title,
      content,
      fileUrl,
      addedBy: req.user._id,
      workspace: req.user.workspaceId,
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all family items
 * @route  GET /api/family
 * @access Private
 */
export const getFamilyItems = async (req, res, next) => {
  try {
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
