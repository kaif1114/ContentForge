import { PostData } from "@/routes/create"
import { Post } from "@/types/content"
import api from "@/utils/axios"
import {useMutation} from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"


function useGeneratePosts(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["generatePosts"],
        mutationFn: async (data: PostData) => {
            return api.post<Post[]>("/posts/generate", data)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["generatedPosts"], data)
        },
        onError: (error) => {
            console.error(error)
        }
    })
}

export default useGeneratePosts