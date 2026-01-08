import StudyDocument from "../models/StudyDocument.js";

/* =========================================================
   📤 UPLOAD DOCUMENT (WORKSPACE SHARED)
   POST /api/study/documents
========================================================= */
export const uploadDocument = async (req, res, next) => {
  try {
    const { title, category, fileUrl } = req.body;

    /* 🔒 VALIDATION */
    if (!title?.trim()) {
      return res.status(400).json({
        message: "Document title is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Document category is required",
      });
    }

    if (!fileUrl) {
      return res.status(400).json({
        message: "Document file is required",
      });
    }

    if (!req.user?.workspaceId) {
      return res.status(400).json({
        message: "User is not part of any workspace",
      });
    }

    /* 📄 CREATE DOCUMENT */
    const document = await StudyDocument.create({
      title: title.trim(),
      category,
      fileUrl,
      uploadedBy: req.user._id,
      workspace: req.user.workspaceId,
    });

    /* 🎉 RESPONSE */
    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   📥 GET DOCUMENTS
   GET /api/study/documents?category=study_material
========================================================= */
export const getDocuments = async (req, res, next) => {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({
        message: "User is not part of any workspace",
      });
    }

    const filter = {
      workspace: req.user.workspaceId,
    };

    /* 🗂 OPTIONAL CATEGORY FILTER */
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const documents = await StudyDocument.find(filter)
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 })
      .lean(); // ⚡ performance

    res.json(documents);
  } catch (error) {
    next(error);
  }
};
