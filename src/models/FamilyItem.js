import mongoose from "mongoose";

const familyItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["note", "document"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String, // text OR file URL
    },
    fileUrl: {
      type: String, // for documents (future upload)
    },
    addedBy: {
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

const FamilyItem = mongoose.model("FamilyItem", familyItemSchema);
export default FamilyItem;
