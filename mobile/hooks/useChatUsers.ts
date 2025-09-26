import { messageApi, useApiClient } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useChatUsers = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: chatUsers ,
    isLoading,
    error,
    refetch:refetchChatUsers
  } = useQuery({
    queryKey: ["chatUsers"],
    queryFn: () => messageApi.getChatUsers(api),
    select: (res) => res.data.chattingUsers,
  });

  // const deleteChatMutation = useMutation({
  //   mutationFn: (userId: string) => messageApi.deleteChatUser(api, userId),
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chatUsers"] }),
  // });

  return {
    chatUsers:chatUsers || [],
    isLoading,
    error,
    refetchChatUsers,
    // deleteChatUser: deleteChatMutation.mutate,
  };
};
