import express from "express";
import {
  followUser,
  getCurrentUser,
  getUserProfile,
  searchUsers,
  syncUser,
  updateProfile,
  updateProfileImage,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
const router = express.Router();

//public routes
router.get("/profile/:username", getUserProfile);

//protected routes
router.post("/sync", protectRoute, syncUser);
router.get("/me", protectRoute, getCurrentUser);
router.put("/profile", protectRoute, updateProfile);
router.put(
  "/updateProfileImage",
  protectRoute,
  upload.single("image"),
  updateProfileImage
);
router.post("/follow/:targetUserId", protectRoute, followUser);

// 🔍 Search route
router.get("/search", searchUsers);
export default router;
