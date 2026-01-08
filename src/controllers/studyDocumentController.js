import StudyDocument from "../models/StudyDocument.js";

export const uploadDocument = async (req, res, next) => {
  try {
    const doc = await StudyDocument.create({
      ...req.body,
      uploadedBy: req.user._id,
      workspace: req.user.workspaceId,
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const filter = {
      workspace: req.user.workspaceId,
    };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const docs = await StudyDocument.find(filter)
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });

    res.json(docs);
  } catch (err) {
    next(err);
  }
};
