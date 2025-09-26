import { messageApi, useApiClient } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMessages = (targetUserId?: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  // fetch messages with a specific user
  const {
    data: msg,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages", targetUserId],
    queryFn: () => messageApi.getMessages(api, targetUserId!),
    select: (res) => res.data.messages,
    enabled: !!targetUserId, // only run when user is selected
  });

 

  return {
    messages:msg || [],
    isLoading,
    error,
    refetch,
  };
};
