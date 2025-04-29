import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios"

const useDeletePost = () => {
    return useMutation({
        mutationKey: ["deletePost"],
        mutationFn: (postId: string) => api.delete(`/posts/${postId}`),
    });
};

export default useDeletePost;
