import crypto from "crypto";
import Workspace from "../models/Workspace.js";
import User from "../models/userModel.js";

export const createWorkspace = async (req, res) => {
  try {
    if (req.user.workspaceId) {
      return res
        .status(400)
        .json({ message: "User already belongs to a workspace" });
    }

    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ message: "Workspace type required" });
    }

    let inviteCode;
    let exists = true;

    while (exists) {
      inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();
      exists = await Workspace.exists({ inviteCode });
    }

    const workspace = await Workspace.create({
      type,
      inviteCode,
      members: [req.user._id],
    });

    await User.findByIdAndUpdate(req.user._id, {
      workspaceId: workspace._id,
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: "Failed to create workspace" });
  }
};

export const joinWorkspace = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code required" });
    }

    const workspace = await Workspace.findOne({ inviteCode });
    if (!workspace) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    if (!workspace.members.includes(req.user._id)) {
      workspace.members.push(req.user._id);
      await workspace.save();
    }

    await User.findByIdAndUpdate(req.user._id, {
      workspaceId: workspace._id,
    });

    res.json({ message: "Joined workspace successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to join workspace" });
  }
};

export const getWorkspaceMembers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "workspaceId",
      populate: {
        path: "members",
        select: "name username",
      },
    });

    if (!user.workspaceId) {
      return res.status(404).json({ message: "No workspace found" });
    }

    res.json(user.workspaceId.members);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch members" });
  }
};
