import api from "@/utils/axios";
import { getFingerprint } from "@/utils/fingerprint";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute('/oauth-callback')({
    component: OAuthCallback,
    validateSearch: (search: { userId: string }) => {
      return search;
    },
  })
export default function OAuthCallback() {
    const {userId} =  Route.useSearch()
    const navigate = useNavigate()
    useEffect(() => {

      async function completeOAuth(userId: string) {
        const fingerprint = await getFingerprint()
        await api.post("/auth/complete-oauth", {
         userId,
        }, {
         headers: {
             "x-fp": fingerprint
         }
        })
        navigate({to: "/"})
     }
        completeOAuth(userId)
        
    }, [userId])

    return <div></div>
}
  