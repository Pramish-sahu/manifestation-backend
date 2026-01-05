import crypto from "crypto";
import Workspace from "../models/Workspace.js";
import User from "../models/userModel.js";

/* CREATE WORKSPACE */
export const createWorkspace = async (req, res) => {
  try {
    if (req.user.workspaceId) {
      return res.status(400).json({
        message: "User already belongs to a workspace",
      });
    }

    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ message: "Workspace type required" });
    }

    let inviteCode;
    do {
      inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    } while (await Workspace.exists({ inviteCode }));

    const workspace = await Workspace.create({
      type,
      inviteCode,
      members: [req.user._id],
    });

    req.user.workspaceId = workspace._id;
    await req.user.save();

    res.status(201).json({
      _id: workspace._id,
      type: workspace.type,
      inviteCode: workspace.inviteCode,
    });
  } catch {
    res.status(500).json({ message: "Failed to create workspace" });
  }
};

/* JOIN WORKSPACE */
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

    req.user.workspaceId = workspace._id;
    await req.user.save();

    res.json({ message: "Joined workspace successfully" });
  } catch {
    res.status(500).json({ message: "Failed to join workspace" });
  }
};

/* GET MEMBERS */
export const getWorkspaceMembers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "workspaceId",
        populate: {
          path: "members",
          select: "name username",
        },
      });

    res.json(user.workspaceId.members);
  } catch {
    res.status(500).json({ message: "Failed to fetch members" });
  }
};
