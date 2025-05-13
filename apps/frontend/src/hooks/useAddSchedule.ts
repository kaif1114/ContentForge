import api from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useAddSchedule = () => {
  return useMutation({
    mutationKey: ["addSchedule"],
    mutationFn: ({
      postId,
      platform,
      scheduleDate,
    }: {
      postId: string;
      platform: string;
      scheduleDate: Date;
    }) => {
      return api.post("/schedule", {
        postId,
        platform,
        scheduleDate: scheduleDate.toISOString(),
      });
    },
  });
};
