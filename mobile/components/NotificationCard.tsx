import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Notification } from "@/types";
import { Feather } from "@expo/vector-icons";

interface NotificationCardProps {
  notification: Notification;
  onDelete: (notificationId: string) => void;
}

const NotificationCard = ({
  notification,
  onDelete,
}: NotificationCardProps) => {
  console.log({ notification });
  const getNotificationText = () => {
    const name = `${notification.from.firstname} ${notification.from.lastname}`;
    switch (notification.type) {
      case "like":
        return `${name} liked your post`;
      case "comment":
        return `${name} commented on your post`;
      case "follow":
        return `${name} started following you`;
      default:
        return "";
    }
  };
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "like":
        return <Feather name="heart" size={20} color="#E0245E" />;
      case "comment":
        return <Feather name="message-circle" size={20} color="#1DA1F2" />;
      case "follow":
        return <Feather name="user-plus" size={20} color="#17BF63" />;
      default:
        return <Feather name="bell" size={20} color="#657786" />;
    }
  };

  return (
    <View className="border-b border-gray-100 bg-white">
      <View className="flex-row p-4">
        <View className="relative mr-3">
          <Image
            source={{ uri: notification.from.profilePicture }}
            className="size-12 rounded-full"
          />

          <View className="abolute -bottom-1 -right-1 size-6 bg-white items-center justify-center">
            {getNotificationIcon()}
          </View>
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-1">
            <View className="flex-1">
              <Text className="text-gray-900 text-base leading-5 mb-1">
                <Text className="font-semibold">
                  {notification.from.firstname} {notification.from.lastname}
                </Text>
                <Text className="text-gray-500">
                  {" "}
                  @{notification.from.username}
                </Text>
              </Text>
              <Text className="text-gray-700 text-sm mb-2">
                {getNotificationText()}
              </Text>
            </View>

            <TouchableOpacity className="ml-2 p-1" onPress={() => {}}>
              <Feather name="trash" size={16} color="#E0245E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default NotificationCard;
