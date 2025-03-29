import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: () => {
            const user = localStorage.getItem("user");
            if (user) {
                return JSON.parse(user);
            }
            else{
                return api.get("/user");
            }
        },
        staleTime: 1000 * 60 * 5,
    });
}

export default useUser;