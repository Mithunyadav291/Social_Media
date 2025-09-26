import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useChatUsers } from "@/hooks/useChatUsers";
import { useSendMessage } from "@/hooks/useSendMessage";
import MessageSection from "@/components/MessageSection";
import axios from "axios";
import { useSearchUsers } from "@/hooks/useSearchUsers";

const MessageScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [lastMessage, setLastMessage] = useState("");

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  //search users for message
  const { searchUsers } = useSearchUsers();

  // Chat Users
  const {
    chatUsers,
    isLoading: usersLoading,
    refetchChatUsers,
    // deleteChatUser
  } = useChatUsers();

  const deleteConversation = (conversationId: number) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            //deletechatuser
          },
        },
      ]
    );
  };
  const openConversation = (chatUser) => {
    setSelectedConversation(chatUser);

    setIsChatOpen(true);
  };

  const closeChatModal = () => {
    setIsChatOpen(false);
    setSelectedConversation(null);
    // setNewMessage("");
    refetchChatUsers();
  };

  const fetchUsers = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await searchUsers(query); // await async mutate
      // setResults(res.data); // direct API data
      setSearchResults(res.users || []);
    } catch (err) {
      console.log("Search error:", err);
      setSearchResults([]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Messages</Text>
        <TouchableOpacity>
          <Feather name="edit" size={24} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      {/* search bar */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder="Search for people and groups"
            className="flex-1 ml-3 text-base outline-none"
            placeholderTextColor="#657786"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              fetchUsers(text);
            }}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText("")}
              className="mr-2 p-1 rounded-full"
            >
              <Feather name="x" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* conversations list */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* search list */}
        {searchText.length > 0 && (
          <>
            <View className="px-4 py-1">
              <Text className="text-xl font-bold text-gray-900 mb-4">
                Search Results
              </Text>
            </View>
            {searchResults.length > 0 ? (
              <>
                {searchResults.map((user) => (
                  <TouchableOpacity
                    key={user?._id}
                    onPress={() => openConversation(user)}
                    className="flex flex-row gap-4 items-center py-3 px-4 border-b border-gray-200 "
                  >
                    <Image
                      source={{
                        uri: user?.profilePicture
                          ? user.profilePicture
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSYbP-248zDkKcJG_swsx0pK2Hhe8hwE0fHQ&s",
                      }}
                      resizeMode="contain"
                      className="size-10 rounded-full"
                    />
                    <View>
                      <Text className="font-bold text-gray-900 text-lg">
                        {user?.firstname} {user?.lastname}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        @{user?.username} {user?._id}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View className="flex-1 items-center p-8">
                <Text className="text-gray-500">No users found</Text>
              </View>
            )}
          </>
        )}

        {/* conversation list */}
        {!searchText && (
          <>
            {chatUsers ? (
              <View>
                {chatUsers.map((chatUser) => (
                  <TouchableOpacity
                    key={chatUser._id}
                    className="flex-row  items-center p-4 border-b border-gray-50 active:bg-gray-50"
                    onPress={() => openConversation(chatUser)}
                    onLongPress={() => deleteConversation(chatUser._id)}
                  >
                    <Image
                      source={{ uri: chatUser.profilePicture }}
                      className="size-12 rounded-full mr-3"
                    />

                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1">
                        <View className="flex-row items-center gap-1">
                          <Text className="font-semibold text-gray-900">
                            {chatUser.firstname} {chatUser.lastname}
                          </Text>

                          <Feather
                            name="check-circle"
                            size={16}
                            color="#1DA1F2"
                            className="ml-1"
                          />

                          <Text className="text-gray-500 text-sm ml-1">
                            @{chatUser.username}
                          </Text>
                        </View>
                        <Text className="text-gray-500 text-sm">
                          2h
                          {/* last message time */}
                        </Text>
                      </View>
                      <Text className="text-sm text-gray-500" numberOfLines={1}>
                        last message {lastMessage?.content}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="p-8  items-center ">
                <Text className="text-gray-500">No conversations yet</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View className="px-4 py-2 border-t border-gray-100 bg-gray-50 ">
        <Text className="text-xs text-gray-500 text-center">
          Tap to open • Long press to delete
        </Text>
      </View>

      {/* chat screen */}

      <Modal
        visible={isChatOpen}
        animationType="slide" //slide, fade,none
        presentationStyle="pageSheet" //formSheet, fullScreen, overFullScreen, pageSheet
        onRequestClose={closeChatModal}
      >
        {selectedConversation && (
          <SafeAreaView className="flex-1">
            {/* Chat Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
              <TouchableOpacity onPress={closeChatModal} className="mr-3">
                <Feather name="arrow-left" size={24} color="#1DA1F2" />
              </TouchableOpacity>
              <Image
                source={{ uri: selectedConversation.profilePicture }}
                className="size-10 rounded-full mr-3"
              />
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="font-semibold text-gray-900 mr-1">
                    {selectedConversation.firstname}{" "}
                    {selectedConversation.lastname}
                  </Text>

                  <Feather name="check-circle" size={16} color="#1DA1F2" />
                </View>
                <Text className="text-gray-500 text-sm">
                  @{selectedConversation.username}
                </Text>
              </View>
            </View>

            {/* Chat Messages Area */}
            <MessageSection
              targetUser={selectedConversation}
              onLastMessage={(msg) => {
                // console.log("Recent message:", msg.content);
                setLastMessage(msg);
              }}
            />
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default MessageScreen;
