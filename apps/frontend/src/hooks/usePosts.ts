import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@/types/content";

interface PaginationParams {
    page?: number;
    limit?: number;
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const usePosts = (params: PaginationParams = {}) => {
    const { page = 1, limit = 10 } = params;
    
    return useQuery({
        queryKey: ["posts", { page, limit }],
        queryFn: async () => {
            return api.get<PaginatedResponse<Post>>("/posts", {
                params: { page, limit }
            });
        },
    });
};
