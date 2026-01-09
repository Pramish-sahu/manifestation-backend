import mongoose from "mongoose";

const dailyActivitySchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    activities: {
      study: { type: Boolean, default: false },
      mantra: { type: Boolean, default: false },
      wish1111: { type: Boolean, default: false },
      manifestation: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

dailyActivitySchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyActivity", dailyActivitySchema);
