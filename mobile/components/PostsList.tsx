import { View, Text } from "react-native";
import React from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const PostsList = () => {
  const { currentUser, error, isLoading, refetch } = useCurrentUser();
  console.log("currentUser:", { currentUser });
  return (
    <View>
      <Text>postLists</Text>
    </View>
  );
};

export default PostsList;
 