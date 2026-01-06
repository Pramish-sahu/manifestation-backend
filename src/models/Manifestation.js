import mongoose from "mongoose";

const manifestationSchema = new mongoose.Schema(
  {
    /* 📝 POINT-WISE MANIFESTATION */
    points: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    /* 🏷 CATEGORY (future use: career, health, money, etc.) */
    category: {
      type: String,
      default: "general",
    },

    /* 📅 DAILY MANIFESTATION FLAG */
    isDaily: {
      type: Boolean,
      default: true,
    },

    /* 👤 CREATOR */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* 👥 SHARED WORKSPACE */
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* ✅ SAFE MODEL EXPORT (NO OVERWRITE ISSUE) */
const Manifestation =
  mongoose.models.Manifestation ||
  mongoose.model("Manifestation", manifestationSchema);

export default Manifestation;
