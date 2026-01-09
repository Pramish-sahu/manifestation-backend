import Vault from "../models/Vault.js";
import { decrypt, encrypt } from "../utils/encrypt.js";

/* ================= ADD PASSWORD ================= */
export const addVaultItem = async (req, res, next) => {
  try {
    const { title, username, secret, note, importance } = req.body;

    if (!title || !username || !secret) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const encrypted = encrypt(secret);

    const vault = await Vault.create({
      title: title.trim(),
      username: username.trim(),
      secret: encrypted,
      note: note?.trim() || "",
      importance: importance || "medium",
      user: req.user._id,
      workspace: req.user.workspaceId,
    });

    res.status(201).json(vault);
  } catch (error) {
    next(error);
  }
};

/* ================= GET PASSWORDS ================= */
export const getVaultItems = async (req, res, next) => {
  try {
    const items = await Vault.find({
      workspace: req.user.workspaceId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const decrypted = items.map((item) => ({
      ...item.toObject(),
      secret: decrypt(item.secret),
    }));

    res.json(decrypted);
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE ================= */
export const deleteVaultItem = async (req, res, next) => {
  try {
    const item = await Vault.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await item.deleteOne();
    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};
