import { useApiClient } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const useUpdateProfile = (username?: string) => {
  const [selectedProfileImage, setSelectedProfileImage] = useState<
    string | null
  >(null);
  const [selectedBannerImage, setSelectedBannerImage] = useState<string | null>(
    null
  );

  const api = useApiClient();
  const queryClient = useQueryClient();

  const updateImageMutation = useMutation({
    mutationFn: async ({
      imageUri,
      type,
    }: {
      imageUri: string;
      type: "profile" | "banner";
    }) => {
      const formData = new FormData();

      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1].toLowerCase();

      const mimeTypeMap: Record<string, string> = {
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
      };
      const mimeType = mimeTypeMap[fileType] || "image/jpeg";

      formData.append("image", {
        uri: imageUri,
        name: `image.${fileType}`,
        type: mimeType,
      } as any);
      //  console.log({formData})

      return api.put(`/user/updateProfileImage?type=${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      setSelectedBannerImage(null);
      setSelectedProfileImage(null);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", username] });
      Alert.alert("Success", "Profile Image updated successfully!");
    },
    onError: () => {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    },
  });

  const pickImageFromGallery = async (type: "profile" | "banner") => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      const source = "photo library";
      Alert.alert(
        "Permission needed",
        `Please grant permission to access your ${source}`
      );
      return;
    }

    const pickerOptions = {
      allowsEditing: true,
      aspect: [1, 1] as [number, number],
      quality: 0.8,
    };

    const result = await ImagePicker.launchImageLibraryAsync({
      ...pickerOptions,
      mediaTypes: ["images"],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (type === "profile") setSelectedProfileImage(uri);
      else setSelectedBannerImage(uri);
    }
  };

  const updateProfileImage = () => {
    if (!selectedProfileImage) {
      return Alert.alert("Empty", "Please choose a profile image first!");
    }

    updateImageMutation.mutate({
      imageUri: selectedProfileImage,
      type: "profile",
    });
  };
  const updateBannerImage = () => {
    if (!selectedBannerImage) {
      return Alert.alert("Empty", "Please choose a banner image first!");
    }

    updateImageMutation.mutate({
      imageUri: selectedBannerImage,
      type: "banner",
    });
  };

  return {
    selectedProfileImage,
    selectedBannerImage,
    isUpdating: updateImageMutation.isPending,
    pickImageFromGallery,
    removeProfileImage: () => setSelectedProfileImage(null),
    removeBannerImage: () => setSelectedBannerImage(null),
    updateProfileImage,
    updateBannerImage,
  };
};
