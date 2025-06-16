import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axios";
import { Post } from "@/types/content";

interface GenerateFromIdeaRequest {
  ideaId: string;
  count: number;
  platform: "linkedin" | "x" | "both";
  tone: "professional" | "narrative" | "informative" | "persuasive" | "casual" | "formal" | "neutral";
  length?: "short" | "medium" | "long";
  customLength?: number;
}

export function useGenerateFromIdea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: GenerateFromIdeaRequest): Promise<Post[]> => {
      const response = await api.post("/posts/generate-from-idea", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate posts query to refresh the posts list
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Failed to generate posts from idea:", error);
    },
  });
} 