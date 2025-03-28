import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {  AxiosResponse, AxiosError } from 'axios'
import api from '@/utils/axios'
import { useMutation } from '@tanstack/react-query'
import { Notification } from '../components/ui/notification'
import { getFingerprint } from '@/utils/fingerprint'

const schema = z.object({
  email: z.string().email({message: "Please enter a valid email"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters"}).max(255),
})

type FormData = z.infer<typeof schema>

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    variant: "success" | "error" | "warning" | "info" | "question";
  } | null>(null)
  const navigate = useNavigate()
  const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const {mutateAsync: login, isPending} = useMutation({
    mutationFn: ({data, fingerprint}: {data: FormData, fingerprint: string}) => {
      return api.post(`/auth`, data, {headers: {
        "x-fp": fingerprint
      }})
    },
    onError: (error: unknown) => {
      console.log("error", error)
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setNotification({
            variant: "error",
            title: "Invalid credentials",
            message: "Please check your email and password and try again."
          })
        } else {
          setNotification({
            variant: "error",
            title: "Oh snap!",
            message: "Change a few things up and try submitting again."
          })
        }
      } else {
        setNotification({
          variant: "error",
          title: "Connection error",
          message: "We couldn't connect to the server. Please try again later."
        })
      }
    },
    onSuccess: (response: AxiosResponse) => {
      setNotification({
        variant: "success",
        title: "Welcome Back!",
        message: "You've successfully logged in."
      })
      setTimeout(() => {
        navigate({ to: "/" })
      }, 1500)
    }
  })

  async function onSubmit(data: FormData) {
    setNotification(null)
    const fingerprint = await getFingerprint()
    await login({data, fingerprint})
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#b5ecda] to-[#f8f7ed]">
      <div className="w-full max-w-md px-6 py-8">
        <div className="mb-8 flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2L2 14H14L8 2Z" fill="white" />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-semibold">Sign in to contentforge</h1>
        <p className="mb-8 text-center text-gray-600 text-sm">
          Create better content and spend less time repurposing.
        </p>

        {notification && (
          <div className="mb-6">
            <Notification 
              
              variant={notification.variant} 
              title={notification.title} 
              message={notification.message} 
              onClose={() => setNotification(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("email")}
              placeholder="Email or username"
              className={`w-full rounded-full border ${
                errors.email ? "border-red-400" : "border-gray-200"
              } px-4 py-3 text-sm focus:border-[#45c19a] focus:outline-none`}
            />
            {errors.email && (
              <p className="mt-1 pl-4 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full rounded-full border ${
                errors.password ? "border-red-400" : "border-gray-200"
              } px-4 py-3 text-sm focus:border-[#45c19a] focus:outline-none`}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
            {errors.password && (
              <p className="mt-1 pl-4 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full rounded-full bg-[#45c19a] py-3 text-white hover:bg-[#45c19a]/90 disabled:opacity-70"
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="mx-4 text-sm text-gray-500">Or authorize with</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={()=>{
            window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
          }} className="flex items-center justify-center rounded-full border border-gray-200 py-3 text-sm">
            <svg
              className="mr-2"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.1711 8.36788H17.5V8.33329H10V11.6666H14.6789C14.0454 13.6063 12.1711 15 10 15C7.23859 15 5.00001 12.7614 5.00001 10C5.00001 7.23858 7.23859 5 10 5C11.2789 5 12.4453 5.48083 13.3281 6.26625L15.7211 3.87329C14.1008 2.32913 12.1555 1.36371 10 1.36371C5.22201 1.36371 1.36371 5.22201 1.36371 10C1.36371 14.778 5.22201 18.6363 10 18.6363C14.778 18.6363 18.6363 14.778 18.6363 10C18.6363 9.43788 18.5817 8.89096 18.1711 8.36788Z"
                fill="#FFC107"
              />
              <path
                d="M2.62964 6.12037L5.36622 8.12913C6.10309 6.29579 7.90183 5 10 5C11.2789 5 12.4453 5.48083 13.3281 6.26625L15.7211 3.87329C14.1008 2.32913 12.1555 1.36371 10 1.36371C6.82838 1.36371 4.07672 3.37846 2.62964 6.12037Z"
                fill="#FF3D00"
              />
              <path
                d="M10 18.6363C12.1022 18.6363 14.0011 17.7072 15.6225 16.2181L12.9697 13.9636C12.1057 14.6077 11.0768 14.9999 10 15C7.84333 15 5.97771 13.6218 5.33688 11.6997L2.58146 13.8814C4.00771 16.6723 6.79333 18.6363 10 18.6363Z"
                fill="#4CAF50"
              />
              <path
                d="M18.1711 8.36788H17.5V8.33329H10V11.6666H14.6789C14.3746 12.5891 13.8055 13.3936 13.0578 13.9879L13.0606 13.9863L15.7134 16.2409C15.5306 16.4045 18.6363 14.0909 18.6363 10C18.6363 9.43788 18.5817 8.89096 18.1711 8.36788Z"
                fill="#1976D2"
              />
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center rounded-full border border-gray-200 py-3 text-sm">
            <svg
              className="mr-2"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0756 10.5C14.0654 8.95203 14.8624 7.80857 16.4679 6.94451C15.6252 5.72738 14.3819 5.05603 12.7764 4.9345C11.2526 4.81297 9.57823 5.79048 8.99442 5.79048C8.37008 5.79048 6.89568 4.9853 5.72138 4.9853C3.70993 5.02611 1.5 6.64342 1.5 9.93239C1.5 10.9099 1.67366 11.9282 2.02098 12.9873C2.49968 14.4093 4.26887 17.9801 6.11744 17.9189C7.13571 17.8883 7.84662 17.1457 9.18046 17.1457C10.4735 17.1457 11.1232 17.9189 12.2771 17.9189C14.1461 17.8883 15.7312 14.6343 16.1795 13.2124C13.7949 11.9282 14.0756 10.5612 14.0756 10.5ZM11.8232 3.5C13.1367 1.93188 12.9631 0.5 12.9631 0.5C11.7684 0.561451 10.3937 1.37551 9.63224 2.33266C8.79913 3.35095 8.41129 4.5477 8.53442 5.75C9.79137 5.81145 10.7096 5.02611 11.8232 3.5Z"
                fill="black"
              />
            </svg>
            Apple
          </button>
        </div>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-[#45c19a]">
            Forgot password?
          </a>
          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="text-[#45c19a]">
              Sign up
            </a>
          </p>
         
        </div>
      </div>
    </div>
  )
}

