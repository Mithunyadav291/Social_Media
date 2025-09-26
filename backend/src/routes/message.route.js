import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteMessage,
  deleteWholeChat,
  getChattingUser,
  getMessages,
  sendMessages,
} from "../controllers/message.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/getChatUser", protectRoute, getChattingUser);
router.post(
  "/send/:targetUserId",
  protectRoute,
  upload.single("image"),
  sendMessages
);

router.put("/deleteChatUser/:deleteChatUserId", protectRoute, deleteWholeChat);
router.delete("/deleteMessage/:messageId", protectRoute, deleteMessage);
router.get("/:targetUserId", protectRoute, getMessages);
export default router;
