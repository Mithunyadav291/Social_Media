import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import SignOutButton from "@/components/SignOutButton";
import { format } from "date-fns";
import { usePosts } from "@/hooks/usePosts";
import PostsList from "@/components/PostsList";

const ProfileScreen = () => {
  const { currentUser, isLoading, error, refetch } = useCurrentUser();
  const insets = useSafeAreaInsets();

  const {
    posts: userPosts,
    refetch: refetchPosts,
    isLoading: isRefetching,
  } = usePosts(currentUser?.username);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {currentUser.firstname} {currentUser.lastname}
          </Text>

          <Text className="text-sm font-semibold text-gray-500">3 Posts</Text>
        </View>
        <SignOutButton />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isRefetching}
        //     onRefresh={() => {
        //       refetchProfile();
        //       refetchPosts();
        //     }}
        //     tintColor="#1DA1F2"
        //   />
        // }
      >
        <Image
          source={{
            uri:
              currentUser.bannerImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="px-4 pb-4 border-b border-gray-100">
          {/* profile image */}
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <Image
              source={{ uri: currentUser.profilePicture }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <TouchableOpacity
              className="flex-row gap-2 border border-gray-300 px-4 py-2 rounded-full"
              // onPress={openEditModal}
            >
              <Feather name="edit" size={16} color="#1DA1F2" />
              <Text className="font-semibold text-gray-900">Edit profile</Text>
            </TouchableOpacity>
          </View>

          {/* username name and details */}
          <View className="mb-4 ">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {currentUser.firstname} {currentUser.lastname}
              </Text>
              <Feather name="check-circle" size={20} color="#1DA1F2" />
            </View>
            <Text className="text-gray-500 mb-2">@{currentUser.username}</Text>
            {currentUser.bio && (
              <Text className="text-gray-900 mb-3">{currentUser.bio}</Text>
            )}

            {currentUser.location && (
              <View className="flex-row items-center mb-2">
                <Feather name="map-pin" size={16} color="#657786" />
                <Text className="text-gray-500 ml-2">
                  {currentUser.location}
                </Text>
              </View>
            )}
            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">
                Joined {format(new Date(currentUser.createdAt), "MMMM yyyy")}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity className="mr-6 border border-gray-300 rounded-full px-4 py-2">
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {currentUser.following?.length}
                  </Text>
                  <Text className="text-gray-500"> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="border border-gray-300 rounded-full px-4 py-2">
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {currentUser.followers?.length}
                  </Text>
                  <Text className="text-gray-500"> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PostsList username={currentUser?.username} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
