import mongoose from "mongoose";

const manifestationSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "general",
    },

    isDaily: {
      type: Boolean,
      default: true,
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

const Manifestation = mongoose.model("Manifestation", manifestationSchema);
export default Manifestation;
