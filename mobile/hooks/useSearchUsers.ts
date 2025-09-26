import { useApiClient, userApi } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

export const useSearchUsers = () => {
  const api = useApiClient();

  const searchUserMutation = useMutation({
    mutationFn: (query: string) => userApi.searchUser(api, query).then((res) => {
        return res.data
    }),
  });

  return {
    searchUsers: searchUserMutation.mutateAsync, // use async version

  };
};
