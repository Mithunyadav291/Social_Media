import { View, Text, Alert, Image } from "react-native";
import React from "react";
import { Post, User } from "@/types";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  isLiked?: boolean;
  currentUser: User;
}

const PostCard = ({
  post,
  onLike,
  onDelete,
  currentUser,
  isLiked,
}: PostCardProps) => {
  const isOwnPost = post.user._id === currentUser._id;
  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(post._id),
      },
    ]);
  };
  return (
    <View className="border-b border-gray-900 bg-white">
      <View className="flex-row p-4">
        <Image
          source={{ uri: post.user.profilePicture || "" }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <View>
            <View>
              <Text>
                {post.user.firstName} {post.user.lastname}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
