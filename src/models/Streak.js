import mongoose from "mongoose";

const streakSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["study", "mantra", "ritual"],
      required: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastCompleted: {
      type: Date,
      default: null,
    },
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
  },
  { timestamps: true }
);

const Streak = mongoose.model("Streak", streakSchema);
export default Streak;
