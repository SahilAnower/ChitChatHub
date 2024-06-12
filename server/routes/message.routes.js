import express from "express";
import {
  getMessages,
  sendMessage,
  updateMessageSingle,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/protectRoutes.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.put("/:messageId", protectRoute, updateMessageSingle);

export default router;
