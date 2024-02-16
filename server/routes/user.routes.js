import express from "express";
import { getUsersForSidebar } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/protectRoutes.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);

export default router;
