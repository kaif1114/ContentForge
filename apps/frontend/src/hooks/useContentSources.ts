import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { ContentSource } from "@/types/content";
import { PaginationParams, PaginatedResponse } from "@/types/pagination";

export const useContentSources = (
  params: PaginationParams = { page: 1, limit: 3 }
) => {
  const { page = 1, limit = 3 } = params;

  return useQuery({
    queryKey: ["content-sources", page, limit],
    queryFn: () => {
      return api.get<PaginatedResponse<ContentSource>>(
        `/content-sources?page=${page}&limit=${limit}`
      );
    },
    staleTime: 1000 * 60 * 5,
  });
};
