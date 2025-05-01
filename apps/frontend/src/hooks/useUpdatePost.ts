import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Post } from "@/types/content"
import api from "@/utils/axios"



export const useUpdatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (post: Partial<Post>) => {
            return api.patch(`/posts/${post._id}`, post)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
        }
    })
}
