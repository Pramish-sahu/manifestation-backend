import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

/* ================= REGISTER ================= */
export const registerUser = async (req, res, next) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      res.status(400);
      throw new Error("All fields required");
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      username,
      password, // 🔥 plain password, model will hash
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};
