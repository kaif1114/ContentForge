import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@/types/content";
import { PaginationParams, PaginatedResponse } from "@/types/pagination";

export const usePosts = (params: PaginationParams = {}) => {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["posts", { page, limit }],
    queryFn: async () => {
      return api.get<PaginatedResponse<Post>>("/posts", {
        params: { page, limit },
      });
    },
  });
};
