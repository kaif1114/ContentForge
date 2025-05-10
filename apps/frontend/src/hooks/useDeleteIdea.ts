import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";

const useDeleteIdea = () => {
  return useMutation({
    mutationKey: ["deleteIdea"],
    mutationFn: (ideaId: string) => api.delete(`/ideas/${ideaId}`),
  });
};

export default useDeleteIdea;
