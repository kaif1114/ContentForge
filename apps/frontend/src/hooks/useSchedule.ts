import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Schedule } from "@/types/schedule";

export const useSchedule = (month: number, year: number) => {
  return useQuery({
    queryKey: ["schedule", month, year],
    queryFn: () => {
      console.log(month, year);
      return api.get<Schedule[]>(`/schedule?month=${month}&year=${year}`);
    },
  });
};
