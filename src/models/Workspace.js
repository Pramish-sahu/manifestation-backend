import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["couple", "family", "friends"],
      required: true,
    },
    inviteCode: {
      type: String,
      unique: true,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
