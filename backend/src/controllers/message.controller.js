import { getAuth } from "@clerk/express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";

export const getMessages = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { targetUserId } = req.params;

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser)
    return res.status(404).json({ error: "User not found" });

  //    if (currentUser._id === targetUserId) {
  //     //but here userId is clerkId not _id of mongoose . so we must get its mongoose object _id
  //      return res.status(400).json({ error: "You cannot follow yourself" });
  //   }
  const messages = await Message.find({
    $or: [
      { senderId: currentUser._id, receiverId: targetUserId },
      { senderId: targetUserId, receiverId: currentUser._id },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json({ messages });
});

export const getChattingUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  const currentUser = await User.findOne({ clerkId: userId });
  if (!currentUser) {
    return res.status(404).json({ error: "User not found" });
  }

  // 2️⃣ Get all users whose _id is in currentUser.messages
  const chattingUsers = await User.find(
    { _id: { $in: currentUser.messages } },
    "_id username firstname lastname profilePicture"
  );

  // 3️⃣ Send response
  res.status(200).json({ chattingUsers });
});
export const deleteWholeChat = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { deleteChatUserId } = req.params;

  const currentUser = await User.findOne({ clerkId: userId });
  if (!currentUser) {
    return res.status(404).json({ error: "User not found" });
  }
  const targetUser = await User.findById(deleteChatUserId);
  if (!targetUser) {
    return res.status(404).json({ error: "Target user not found" });
  }

  const isChatting = currentUser.messages.includes(deleteChatUserId);
  if (!isChatting)
    return res.status(400).json({ error: "No conversation found." });

  //
  await User.findByIdAndUpdate(currentUser._id, {
    $pull: { messages: deleteChatUserId },
  });

  res
    .status(200)
    .json({ message: `Deleted chat with ${targetUser?.username}` });
});
export const deleteMessage = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { messageId } = req.params;

  const currentUser = await User.findOne({ clerkId: userId });
  if (!currentUser) {
    return res.status(404).json({ error: "User not found" });
  }
  const message = await Message.findById(messageId);
  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  if (message.senderId.toString() !== currentUser._id.toString()) {
    return res
      .status(403)
      .json({ error: "You can only delete your own message" });
  }
  await Message.findByIdAndDelete(messageId);

  res.status(200).json({ message: `Deleted chat successfully.` });
});

export const sendMessages = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { targetUserId } = req.params;
  const { content } = req.body;
  const imageFile = req.file;

  if (!content && !imageFile) {
    return res
      .status(400)
      .json({ error: "Chat must contain either text or image." });
  }

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser)
    return res.status(404).json({ error: "User not found" });

  if (currentUser._id === targetUserId) {
    //but here userId is clerkId not _id of mongoose . so we must get its mongoose object _id
    return res.status(400).json({ error: "You cannot message yourself" });
  }

  let imageUrl = "";

  //upload image to cloudinary if image file is present
  if (imageFile) {
    try {
      // convert buffer to base64 for cloudinary
      const base64Image = `data:${
        imageFile.mimetype
      };base64,${imageFile.buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "chat_images",
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" },
          { format: "auto" },
        ],
      });
      imageUrl = uploadResponse.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(400).json({ error: "Failed to upload image" });
    }
  }
  const message = await Message.create({
    senderId: currentUser._id,
    receiverId: targetUserId,
    content: content || "",
    image: imageUrl,
  });

  const isChatting = currentUser.messages.includes(targetUserId);

  if (!isChatting) {
    //
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { messages: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $push: { messages: currentUser._id },
    });
  }
  res.status(201).json({ message });
});
