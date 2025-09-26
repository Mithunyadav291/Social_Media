import { useApiClient } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const useSendMessage = () => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const api = useApiClient();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async ({messageData,targetUserId}:{messageData:{content:string; imageUri?:string};targetUserId:string}) => {
      const formData = new FormData();
      
     
      if (messageData.content) formData.append("content", messageData.content);

      if (messageData.imageUri) {
        const uriParts = messageData.imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1].toLowerCase();

        const mimeTypeMap: Record<string, string> = {
          png: "image/png",
          gif: "image/gif",
          webp: "image/webp",
        };
        const mimeType = mimeTypeMap[fileType] || "image/jpeg";

        formData.append("image", {
          uri: messageData.imageUri,
          name: `image.${fileType}`,
          type: mimeType,
        } as any);
        
       
      }
       
       
       return api.post(`message/send/${targetUserId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
    },
    onSuccess: () => {
      setContent("");
      setSelectedImage(null);
       queryClient.invalidateQueries({ queryKey: ["messages",targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["chatUsers"] });
      
    },
    onError: () => {
      // Alert.alert("Error", "Failed to send message. Please try again.");
    },
  });

  const handleImagePicker = async (useCamera: boolean = false) => {
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      const source = useCamera ? "camera" : "photo library";
      Alert.alert(
        "Permission needed",
        `Please grant permission to access your ${source}`
      );
      return;
    }

    const pickerOptions = {
      allowsEditing: true,
      aspect: [16, 16] as [number, number],
      quality: 0.8,
    };

    const result = useCamera
      ? await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync({
          ...pickerOptions,
          mediaTypes: ["images"],
        });

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const sendMessage = (targetUserId: string) => {
    if (!content.trim() && !selectedImage) {
      Alert.alert(
        "Empty Message",
        "Please write something or add an image before messaging!"
      );
      return;
    }
  
    const messageData: { content: string; imageUri?: string } = {
      content: content.trim(),
    };

    if (selectedImage) messageData.imageUri = selectedImage;
    
    sendMessageMutation.mutate({messageData,targetUserId});
  };

  return {
    content,
    setContent,
    selectedImage,
    isSending: sendMessageMutation.isPending,
    pickImageFromGallery: () => handleImagePicker(false),
    takePhoto: () => handleImagePicker(true),
    removeImage: () => setSelectedImage(null),
    sendMessage
    // sendMessage(targetUserId),
  };
};
