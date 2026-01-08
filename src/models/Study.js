import mongoose from "mongoose";

const studySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    hours: {
      type: Number,
      required: true,
      min: 0,
    },

    topic: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Study", studySchema);
