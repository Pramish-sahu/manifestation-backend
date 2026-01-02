import Vault from "../models/Vault.js";
import { decrypt, encrypt } from "../utils/encrypt.js";

export const addVaultItem = async (req, res) => {
  try {
    const { title, username, secret, note } = req.body;

    if (!title || !username || !secret) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const encrypted = encrypt(secret);

    const vault = await Vault.create({
      title,
      username,
      secret: encrypted,
      note,
      user: req.user._id,
      workspace: req.user.workspaceId,
    });

    res.status(201).json(vault);
  } catch (err) {
    res.status(500).json({ message: "Vault save failed" });
  }
};

export const getVaultItems = async (req, res) => {
  try {
    const items = await Vault.find({
      workspace: req.user.workspaceId,
    }).populate("user", "name username");

    const decrypted = items.map((item) => ({
      ...item.toObject(),
      secret: decrypt(item.secret),
    }));

    res.json(decrypted);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
};

export const deleteVaultItem = async (req, res) => {
  try {
    const item = await Vault.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await item.deleteOne();
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};
