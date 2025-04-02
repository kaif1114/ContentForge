import api from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";

function useAddSource(){
    return useMutation({
        mutationFn: ({url, type, label}:{url: string, type: string, label: string})=>{
            return api.post('/scrape', {url, type, label})
        }
    })
}

export default useAddSource