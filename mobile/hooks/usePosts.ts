import { postApi, useApiClient } from "@/utils/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const usePosts=()=>{
    const api=useApiClient();
    const queryClient=useQueryClient();

    const {
        data:postsData,
        isLoading,
        error,
        refetch
    }=useQuery({
     queryKey:["posts"],
        queryFn:()=>postApi.getPosts(api),
        select:(response)=>response.data.user,
    })

    const likePostMutation=useMutation({
        mutationFn:(postId:string)=>postApi.likePost(api,postId),
        onSuccess:()=>queryClient.invalidateQueries({queryKey:['posts']})
    })
}