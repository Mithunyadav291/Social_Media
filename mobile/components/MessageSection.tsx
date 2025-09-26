import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMessages } from "@/hooks/useMessages";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MessagesSection = ({
  targetUser,
  onLastMessage,
}: {
  targetUser?: any;
  onLastMessage?: (msg: any) => void;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, isLoading, error, refetch } = useMessages(targetUser._id);
  const {
    content,
    setContent,
    selectedImage,
    isSending,
    pickImageFromGallery,
    takePhoto,
    removeImage,
    sendMessage,
    // sendMessage(targetUserId),
  } = useSendMessage();
  const { currentUser } = useCurrentUser();

  const formattedMessages = messages.map((msg: any) => ({
    id: msg._id,
    text: msg.content,
    image: msg.image,
    fromUser: msg.senderId === currentUser._id, // true if current user sent it
    time: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const wasSendingRef = useRef(false);

  useEffect(() => {
    if (wasSendingRef.current && !isSending) {
      // ✅ finished sending, now refetch
      refetch();
    }
    wasSendingRef.current = isSending;
  }, [isSending]);
  useEffect(() => {
    if (messages.length > 0 && onLastMessage) {
      const lastMsg = messages[messages.length - 1];
      onLastMessage(lastMsg); // 🔥 send back to parent
    }
  }, [messages]);
  return (
    <>
      {/* message screen */}
      <ScrollView
        className="flex-1 px-4 py-4"
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {isLoading && <ActivityIndicator size="large" color="#1DA1F2" />}
        <View className="mb-4">
          <Text className="text-center text-gray-400 text-sm mb-4">
            This is the beginning of your conversation with{" "}
            {targetUser.firstname}
          </Text>

          {formattedMessages.map((message) => (
            <View
              key={message.id}
              className={`flex-row mb-3 ${message.fromUser ? "justify-start" : ""}`}
            >
              {!message.fromUser && (
                <Image
                  source={{ uri: targetUser.profilePicture }}
                  className="size-8 rounded-full mr-2"
                />
              )}
              <View className={`flex-1 ${message.fromUser ? "items-end" : ""}`}>
                {message.image ? (
                  <Image
                    source={{ uri: message.image }}
                    className="w-40 h-40 rounded-2xl"
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className={`rounded-2xl  px-4 py-3 max-w-xs ${
                      message.fromUser
                        ? "bg-blue-500 self-end"
                        : "bg-gray-100 self-start"
                    }`}
                  >
                    <Text
                      className={
                        message.fromUser ? "text-white" : "text-gray-900"
                      }
                    >
                      {message.text}
                    </Text>
                  </View>
                )}
                <Text className="text-xs text-gray-400 mt-1">
                  {message.time}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* message Input */}

      {selectedImage && (
        <View className="mt-3 ml-15">
          <View className="relative">
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-32 rounded-2xl"
              resizeMode="contain"
            />
            <TouchableOpacity
              className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-60 rounded-full items-center justify-center"
              onPress={removeImage}
            >
              <Feather name="x" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-100">
        <View className="flex-1 flex-row items-center  bg-gray-100 rounded-full px-4 py-3 mr-3">
          {content.length === 0 && (
            <>
              <TouchableOpacity className="mr-4" onPress={pickImageFromGallery}>
                <Feather name="image" size={24} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity className="mr-4" onPress={takePhoto}>
                <Feather name="camera" size={24} color="#1DA1F2" />
              </TouchableOpacity>
            </>
          )}
          <TextInput
            className="flex-1 text-base outline-none"
            placeholder="Start a message..."
            placeholderTextColor="#657786"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={2}
            editable={!selectedImage}
          />
        </View>
        <TouchableOpacity
          onPress={() => sendMessage(targetUser._id)}
          className={`size-10 rounded-full items-center justify-center ${
            content.trim() || selectedImage ? "bg-blue-500" : "bg-gray-300"
          }`}
          disabled={isSending || (!content.trim() && !selectedImage)}
        >
          {isSending ? (
            <ActivityIndicator size={"small"} color="white" />
          ) : (
            <Feather name="send" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};
export default MessagesSection;
