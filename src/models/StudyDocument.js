import mongoose from "mongoose";

const studyDocumentSchema = new mongoose.Schema(
  {
    /* 📄 DOCUMENT TITLE */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* 🗂 CATEGORY (USED FOR FILTERING IN UI) */
    category: {
      type: String,
      enum: ["admit_card", "study_material", "exam_doc"],
      required: true,
    },

    /* 🔗 FILE URL (S3 / Cloudinary / Local later) */
    fileUrl: {
      type: String,
      required: true,
    },

    /* 👤 WHO UPLOADED */
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* 👥 WORKSPACE (SHARED VISIBILITY) */
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* 🚀 INDEX FOR FAST CATEGORY + WORKSPACE QUERY */
studyDocumentSchema.index({ workspace: 1, category: 1 });

export default mongoose.model("StudyDocument", studyDocumentSchema);
