import { redirect } from "@tanstack/react-router"
import api from "./axios"

export async function checkAuth(href: string) {
    const accessToken = localStorage.getItem("access")
    if (!accessToken) {
        throw redirect({to: "/login", search: {redirect: href}})
    }
    const response = await api.get(`${import.meta.env.VITE_API_URL}/auth/verify`)
    if(!response.data.authenticated){
        throw redirect({to: "/login", search: {redirect: href}})
    }
}