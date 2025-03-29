import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { ContentSource } from "@/types/content-sources";
export const useContentSources = () => {
    return useQuery({
        queryKey: ["content-sources"],
        queryFn: () => {
            return api.get<ContentSource[]>(`/content-sources`);
        },
        staleTime: 1000 * 60 * 5,
    });
};
