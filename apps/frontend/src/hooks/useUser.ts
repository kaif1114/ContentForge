import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const user = localStorage.getItem("user");
            if (user) {
                return JSON.parse(user);
            }
            else {
                const response = await api.get("/auth/me");
                localStorage.setItem("user", JSON.stringify(response.data))
                return response.data;
            }
        },
        staleTime: 1000 * 60 * 5,
    });
}

export default useUser;