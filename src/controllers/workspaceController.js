import crypto from "crypto";
import Workspace from "../models/Workspace.js";

/* ======================================================
   CREATE WORKSPACE
   - Allows multiple workspaces per user
   - Sets newly created workspace as ACTIVE
====================================================== */
export const createWorkspace = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Workspace type required" });
    }

    /* 🔐 Generate unique invite code */
    let inviteCode;
    do {
      inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    } while (await Workspace.exists({ inviteCode }));

    /* 👤 Create workspace */
    const workspace = await Workspace.create({
      type,
      inviteCode,
      members: [req.user._id], // creator always member
    });

    /* ⭐ Set ACTIVE workspace (important) */
    req.user.workspaceId = workspace._id;
    await req.user.save();

    res.status(201).json({
      _id: workspace._id,
      type: workspace.type,
      inviteCode: workspace.inviteCode,
      isActive: true,
    });
  } catch (error) {
    console.error("Create Workspace Error:", error);
    res.status(500).json({ message: "Failed to create workspace" });
  }
};

/* ======================================================
   GET INVITE CODE (ACTIVE WORKSPACE)
====================================================== */
export const getInviteCode = async (req, res) => {
  try {
    if (!req.user.workspaceId) {
      return res.status(404).json({ message: "No active workspace found" });
    }

    const workspace = await Workspace.findById(req.user.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json({
      inviteCode: workspace.inviteCode,
      type: workspace.type,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invite code" });
  }
};

/* ======================================================
   JOIN WORKSPACE
   - Adds user if not already member
   - Sets joined workspace as ACTIVE
====================================================== */
export const joinWorkspace = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code required" });
    }

    const workspace = await Workspace.findOne({ inviteCode }).populate(
      "members",
      "name"
    );

    if (!workspace) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    /* ➕ Add member if not exists */
    if (!workspace.members.some((m) => m._id.equals(req.user._id))) {
      workspace.members.push(req.user._id);
      await workspace.save();
    }

    /* ⭐ Set ACTIVE workspace */
    req.user.workspaceId = workspace._id;
    await req.user.save();

    const owner = workspace.members[0];

    res.json({
      message: "Joined workspace successfully",
      ownerName: owner?.name || "Member",
      workspaceType: workspace.type,
      isActive: true,
    });
  } catch (error) {
    console.error("Join Workspace Error:", error);
    res.status(500).json({ message: "Failed to join workspace" });
  }
};

/* ======================================================
   GET MEMBERS (ACTIVE WORKSPACE)
====================================================== */
export const getWorkspaceMembers = async (req, res) => {
  try {
    if (!req.user.workspaceId) {
      return res.status(404).json({ message: "No active workspace" });
    }

    const workspace = await Workspace.findById(req.user.workspaceId).populate(
      "members",
      "name username"
    );

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace.members);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch members" });
  }
};
