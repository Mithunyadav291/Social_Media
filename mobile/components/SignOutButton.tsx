import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useSignOut } from "@/hooks/useSignOut";
import { useClerk } from "@clerk/clerk-expo";

const SignOutButton = () => {
  const { handleSignOut } = useSignOut();
  const { signOut } = useClerk();

  return (
    <TouchableOpacity onPress={signOut}>
      <Feather name="log-out" size={24} color={"#E0245E"} />
    </TouchableOpacity>
  );
};

export default SignOutButton;
