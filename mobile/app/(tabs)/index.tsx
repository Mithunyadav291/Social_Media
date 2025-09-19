import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import { useClerk } from "@clerk/clerk-expo";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import SignOutButton from "@/components/SignOutButton";
import { useUserSync } from "@/hooks/useUserSync";
import { Ionicons } from "@expo/vector-icons";
import PostComposer from "@/components/PostComposer";
import PostsList from "@/components/PostsList";

const HomeScreen = () => {
  // const { signOut } = useClerk();
  // const { isSignedIn, isLoaded, user } = useUser();
  // console.log(user);
  useUserSync(); //for sync user automatically when after signed .

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
        <Text className="text-xl font-bold text-gray-900">Home</Text>
        <SignOutButton />
      </View>

      {/* body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <PostComposer />
        <PostsList />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
