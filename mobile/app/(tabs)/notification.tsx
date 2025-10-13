import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNotifications } from "@/hooks/useNotifications";
import { Feather } from "@expo/vector-icons";
import NotificationCard from "@/components/NotificationCard";
import { Notification } from "@/types";

const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  // const [isRefetching, setIsRefetching] = useState(false);

  const {
    notifications,
    isLoading,
    refetch,
    error,
    isRefetching,
    deleteNotification,
    isDeleteingNotification,
  } = useNotifications();

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-gray-500 mb-4">Failed to load notifications</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => refetch()}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Notifications</Text>
        <TouchableOpacity>
          <Feather name="settings" size={24} color="#657786" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={"#1DA1F2"}
          />
        }
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center p-8">
            <ActivityIndicator size="large" color="#1DA1F2" />
            <Text className="text-gray-500 mt-4">Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          // <NoNotificationsFound />
          <View
            className="flex-1 items-center justify-center px-8 "
            style={{ minHeight: 400 }}
          >
            <View className="items-center">
              <Feather name="bell" size={80} color="#E1E8ED" />
              <Text className="text-2xl font-semibold text-gray-500 mt-6 mb-3">
                No notifications yet
              </Text>
              <Text className="text-gray-400 text-center text-base leading-6 max-w-xs">
                When people like, comment, or follow you, you&apos;ll see it
                here.
              </Text>
            </View>
          </View>
        ) : (
          notifications.map((notification: Notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onDelete={deleteNotification}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
