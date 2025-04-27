import { PostData } from "@/routes/create"
import { Post } from "@/types/content"
import api from "@/utils/axios"
import {useMutation} from "@tanstack/react-query"



function useGeneratePosts(){
    return useMutation({
        mutationFn: async (data: PostData) => {
            return api.post<Post[]>("/posts/generate", data)
        },
        onSuccess: (data) => {
            console.log(data)
        },
        onError: (error) => {
            console.error(error)
        }
    })
}

export default useGeneratePosts