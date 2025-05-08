import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { PaginationParams, PaginatedResponse } from "@/types/pagination";
import { Idea } from "@/types/idea";

export function useIdeas(params: PaginationParams = {}) {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["ideas", { page, limit }],
    queryFn: async () => {
      return api.get<PaginatedResponse<Idea>>("/ideas", {
        params: { page, limit },
      });
    },
  });
}
