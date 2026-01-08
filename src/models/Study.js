import mongoose from "mongoose";

const studySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // improves activity queries
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true, // important for workspace-based sharing
    },

    hours: {
      type: Number,
      required: true,
      min: [0.1, "Study hours must be greater than 0"],
    },

    topic: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt used in activity & stats
  }
);

export default mongoose.model("Study", studySchema);
