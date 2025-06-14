import api from "@/utils/axios";
import { getFingerprint } from "@/utils/fingerprint";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import authStore from "@/utils/store";

export const Route = createFileRoute('/oauth-callback')({
    component: OAuthCallback,
    validateSearch: (search: { userId: string }) => {
      return search;
    },
  })
export default function OAuthCallback() {
    const {userId} =  Route.useSearch()
    const navigate = useNavigate()
    const { setUser } = authStore()
    
    useEffect(() => {

      async function completeOAuth(userId: string) {
        try {
          const fingerprint = await getFingerprint()
          const response = await api.post("/auth/complete-oauth", {
           userId,
          }, {
           headers: {
               "x-fp": fingerprint
           }
          })
   
            // Fetch user data
           if(response.status === 200){
            try {
              const userResponse = await api.get('/auth/me');
              setUser({
                id: userResponse.data.id,
                email: userResponse.data.email,
                name: userResponse.data.name
              });
              navigate({to: "/posts"})
            } catch (error) {
              console.error('Failed to fetch user data:', error);
            }
           }
          
         
        } catch (error) {
          console.error('OAuth completion failed:', error);
          navigate({to: "/login"})
        }
     }
        completeOAuth(userId)
        
    }, [userId, navigate, setUser])

    return <div>Completing login...</div>
}
  