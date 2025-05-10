import api from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";

function useAddIdeas() {
  return useMutation({
    mutationKey: ["addIdeas"],
    mutationFn: async ({
      contentId,
      count,
    }: {
      contentId: string;
      count: number;
    }) => {
      return api.post("/ideas/generate", { contentId, count });
    },
  });
}

export default useAddIdeas;
