import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    importance: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
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

export default mongoose.model("Vault", vaultSchema);
