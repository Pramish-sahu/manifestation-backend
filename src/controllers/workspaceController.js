import crypto from "crypto";
import Workspace from "../models/Workspace.js";
import User from "../models/userModel.js";

/**
 * @desc   Create new workspace
 * @route  POST /api/workspace/create
 * @access Private
 */
export const createWorkspace = async (req, res, next) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Workspace type required" });
    }

    const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

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
    next(error);
  }
};

/**
 * @desc   Join workspace using invite code
 * @route  POST /api/workspace/join
 * @access Private
 */
export const joinWorkspace = async (req, res, next) => {
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
    next(error);
  }
};

/**
 * @desc   Get workspace members
 * @route  GET /api/workspace/members
 * @access Private
 */
export const getWorkspaceMembers = async (req, res, next) => {
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
    next(error);
  }
};
