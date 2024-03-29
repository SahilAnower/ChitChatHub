import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateJWTToken.js";
import { getGoogleUserDetails } from "../services/googleUserDetails.services.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      // console.log("here");
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // HASH PASSWORD

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "Male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      // Generate JWT token
      await newUser.save();

      generateTokenAndSetCookie(newUser?._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signup controller: ", error?.message);
    res.status(500).json({ error: error?.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller", error.message);
    res.status(500).json({ error: error?.message });
  }
};

export const googleSignup = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const data = await getGoogleUserDetails(accessToken);
    const { email, name, picture } = data;
    const username = email.split("@")[0];
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already taken" });
    }
    const newUser = new User({
      fullName: name,
      username,
      profilePic: picture,
      signupType: "Google",
    });

    if (newUser) {
      // Generate JWT token
      await newUser.save();

      generateTokenAndSetCookie(newUser?._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in google signup controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const data = await getGoogleUserDetails(accessToken);
    const { email } = data;
    const user = await User.findOne({ username: email.split("@")[0] });
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    if (user?.signupType !== "Google") {
      return res
        .status(400)
        .json({ error: "Signup type was not google first time!" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in google login controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error.message);
    res.status(500).json({ error: error?.message });
  }
};
