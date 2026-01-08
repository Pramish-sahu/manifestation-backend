import mongoose from "mongoose";

const studySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
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

/* =========================================================
   INDEXES
   - Optimized for workspace activity & daily updates
========================================================= */

/* Faster workspace feed */
studySchema.index({ workspace: 1, createdAt: -1 });

/* Prevent multiple logs per user per day per workspace */
studySchema.index(
  {
    user: 1,
    workspace: 1,
    createdAt: 1,
  },
  { unique: false }
);

export default mongoose.model("Study", studySchema);
