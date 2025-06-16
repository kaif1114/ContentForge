import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axios";

interface GenerateFromSourceRequest {
  contentId: string;
  postCount: number;
  platform: "linkedin" | "x" | "both";
  tone: "professional" | "narrative" | "informative" | "persuasive" | "casual" | "formal" | "neutral";
  length?: "short" | "medium" | "long";
  customLength?: number;
}

export const useGenerateFromSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateFromSourceRequest) => {
      return api.post("/posts/generate", data);
    },
    onSuccess: () => {
      // Invalidate posts query to refresh the posts list
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Failed to generate posts from source:", error);
    },
  });
}; 