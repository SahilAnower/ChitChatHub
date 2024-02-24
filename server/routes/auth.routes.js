import express from "express";
import {
  googleLogin,
  googleSignup,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/google/signup", googleSignup);

router.post("/google/login", googleLogin);

router.post("/logout", logout);

export default router;
