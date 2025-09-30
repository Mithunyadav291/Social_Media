import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Post, User } from "@/types";
import { formatDate, formatNumber } from "@/utils/formatters";
import { AntDesign, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onComment: (post: Post) => void;
  isLiked?: boolean;
  currentUser: User;
}

const PostCard = ({
  post,
  onLike,
  onDelete,
  currentUser,
  isLiked,
  onComment,
}: PostCardProps) => {
  const isOwnPost = post.user._id === currentUser._id;
  const [isImageVisible, setIsImageVisible] = useState(false);

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
  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Cannot save image without permission."
        );
        return;
      }
      const filename = post.image.split("/").pop();
      const fileUri = FileSystem.cacheDirectory + filename;

      const { uri } = await FileSystem.downloadAsync(post.image, fileUri);
      // Save that local file into gallery
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Saved", "Image downloaded to gallery");
    } catch (err) {
      Alert.alert("Error", "Failed to save image");
      console.log("erorr", err);
    }
  };

  const confirmDownload = () => {
    Alert.alert(
      "Download Image",
      "Do you want to save this image to your gallery?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Download",
          onPress: () => handleDownload(), // runs the download
        },
      ]
    );
  };
  return (
    <View className="border-b border-gray-100 bg-white">
      <View className="flex-row p-4">
        <Image
          source={{ uri: post.user.profilePicture || "" }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row justify-between">
            <View className="">
              <Text className="font-bold text-gray-900 mr-1">
                {post.user.firstname} {post.user.lastname}
              </Text>
              <Text className="text-gray-500 ml-1">
                @{post.user.username} · {formatDate(post.createdAt)}
              </Text>
            </View>

            {isOwnPost && (
              <TouchableOpacity onPress={handleDelete}>
                <Feather name="trash" size={20} color="#657786" />
              </TouchableOpacity>
            )}
          </View>
          {post.content && (
            <Text className="text-gray-900 text-base leading-5 mb-3">
              {post.content}
            </Text>
          )}
          {post.image && (
            <>
              {/* Thumbnail */}
              <TouchableOpacity onPress={() => setIsImageVisible(true)}>
                <Image
                  source={{ uri: post.image }}
                  className="w-full h-48 border-2 border-gray-200 rounded-2xl mb-3"
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {/* Fullscreen Modal */}
              <Modal
                visible={isImageVisible}
                transparent={false}
                animationType="slide" // or "fade"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsImageVisible(false)}
              >
                <SafeAreaView className="flex-1  ">
                  {/* Close (X) button */}
                  <TouchableOpacity
                    onPress={() => setIsImageVisible(false)}
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      zIndex: 10, // Make sure it stays above the image
                      padding: 8,
                    }}
                  >
                    <Feather name="x" size={32} color="black" />
                  </TouchableOpacity>

                  {/* Fullscreen image */}
                  <TouchableOpacity
                    className="flex-1 justify-center items-center "
                    onLongPress={() => confirmDownload()}
                    delayLongPress={400}
                  >
                    <Image
                      source={{ uri: post.image }}
                      style={{ width: "90%", height: "50%" }}
                      className="border-2  rounded-xl border-gray-100"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </SafeAreaView>
              </Modal>
            </>
          )}

          <View className="flex-row justify-between max-w-xs pt-1 px-1">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => onComment(post)}
            >
              <Feather name="message-circle" size={18} color="#657786" />
              <Text className="text-gray-500 text-sm ml-2">
                {formatNumber(post.comments?.length || 0)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => {}}
            >
              <Feather name="repeat" size={18} color="#657786" />
              <Text className="text-gray-500 text-sm ml-2">0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => onLike(post._id)}
            >
              {isLiked ? (
                <AntDesign name="heart" size={18} color="#E0245E" />
              ) : (
                <Feather name="heart" size={18} color="#657786" />
              )}
              <Text
                className={`${isLiked ? "text-red-500" : "text-gray-500"} text-sm ml-2`}
              >
                {formatNumber(post.likes?.length || 0)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => {}}
            >
              <Feather name="share" size={18} color="#657786" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
