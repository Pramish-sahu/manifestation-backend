import mongoose from "mongoose";

const studyDocumentSchema = new mongoose.Schema(
  {
    title: String,

    category: {
      type: String,
      enum: ["admit_card", "study_material", "exam_doc"],
    },

    fileUrl: String,

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  },
  { timestamps: true }
);

export default mongoose.model("StudyDocument", studyDocumentSchema);
