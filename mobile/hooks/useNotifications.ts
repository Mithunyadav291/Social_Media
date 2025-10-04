import { notificationsApi, useApiClient } from "@/utils/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useNotifications=()=>{
    const api=useApiClient();
    const queryClient=useQueryClient();

    const {
        data:notificationsData,
        isLoading,
        refetch,
        error,
        isRefetching
    }=useQuery({
        queryKey:["notifications"],
        queryFn:()=>notificationsApi.getNotifications(api),
        select:(res)=>res.data.notifications
    })

    const deleteNotificationMutation=useMutation({
        mutationFn:(notificationId:string)=> api.delete(`/notifications/${notificationId}`),
        onSuccess:()=>queryClient.invalidateQueries({queryKey:["notifications"]})

    })

    const deleteNotification=(notificationId:string)=>{
        deleteNotificationMutation.mutate(notificationId)
    }

    return {
        notifications: notificationsData  || [],
        isLoading,
        refetch,
        error,
        isRefetching,
        deleteNotification,
        isDeleteingNotification:deleteNotificationMutation.isPending
    }
}