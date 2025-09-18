import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useClerk } from "@clerk/clerk-expo";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SignOutButton from "@/components/SignOutButton";
import { useUserSync } from "@/hooks/useUserSync";

const HomeScreen = () => {
  // const { signOut } = useClerk();
  // const { isSignedIn, isLoaded, user } = useUser();
  // console.log(user);
  useUserSync(); //for sync user automatically when after signed .

  return (
    <SafeAreaView className="flex-1">
      <Text>Home screen</Text>
      <SignOutButton />
    </SafeAreaView>
  );
};

export default HomeScreen;
