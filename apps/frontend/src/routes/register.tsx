import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFingerprint } from "@/utils/fingerprint";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import api from "@/utils/axios";
import { EyeOff, Eye, Apple } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Notification } from "@/components/ui/notification"
import { AxiosError } from "axios";
import authStore from "@/utils/store";


export const Route = createFileRoute('/register')({
    component: RegistrationPage,
  })

  const schema = z.object({
    name: z.string().min(1, {message: "Name is required"}).max(50, {message: "Name must be less than 50 characters"}),
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}).max(255, {message: "Password must be less than 255 characters"}),
})

type FormData = z.infer<typeof schema>

export default function RegistrationPage() {

   const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { setUser } = authStore()
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    variant: "success" | "error" | "warning" | "info" | "question";
  } | null>(null)

  const {mutateAsync: registerUser, isPending,  isSuccess} = useMutation({
    mutationFn: ({data, fingerprint}: {data: FormData, fingerprint: string}) => {
      return api.post(`/auth/register`, data, {
        headers: {
          "x-fp": fingerprint
        },
      })
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 && 
          error.response?.data?.error === "User already exists") {
          setNotification({
            variant: "error",
            title: "Registration Failed",
            message: "An account with this email already exists. Please use a different email or sign in."
          })
        } else {
          setNotification({
            variant: "error",
            title: "Registration Failed",
            message: error.response?.data?.message || "Unable to register. Please try again later."
          })
        }
      } else {
        setNotification({
          variant: "error",
          title: "Registration Failed",
          message: "Unable to register. Please try again later."
        })
      }
    },
    onSuccess: async (response) => {
        if (response.status === 201 && response.data.name && response.data.email) {
          setUser({
              id: response.data.id,
              email: response.data.email,
              name: response.data.name
            });
            setNotification({
              variant: "success",
              title: "Success!",
              message: "Your account has been created successfully. Redirecting you..."
            })
            setTimeout(() => {
              navigate({ to: "/posts" })
            }, 1000)
        }
    }
  })

  const onSubmit = async (data: FormData) => {
    setNotification(null)
    const fingerprint = await getFingerprint()
    await registerUser({data, fingerprint})
  }
  

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-gradient-to-tr from-[#b5ecda] to-[#f8f7ed]">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col  h-screen overflow-y-auto">
        <div className="mb-8">
          <div className="inline-block">
            <Link
              to="/"
              className="text-xl font-medium px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100/50 transition-colors"
            >
              contentforge
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Create an account</h1>
          <p className="text-gray-600 mb-8">Sing up and get 30 day free trial</p>

          {/* Notification */}
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
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-600 font-normal">
                Full name
              </Label>
              {errors.name && (
                  <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
                )}
              <Input
                {...register("name")}
                placeholder="Enter your full name"
                className="rounded-full  bg-white h-12 px-5 focus:border-[#3bc5a5] focus:border-2 "
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-600 font-normal">
                Email
              </Label>
              {errors.email && (
                  <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
                )}
              <Input
                {...register("email")}
                placeholder="Enter your email"
                className="rounded-full border-gray-200 bg-white h-12 px-5 focus:border-[#3bc5a5] focus:border-2"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-600 font-normal">
                Password
              </Label>
              <div className="relative">
                {errors.password && (
                  <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
                )}
                <Input
                  
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className="rounded-full border-gray-200 bg-white h-12 px-5 pr-12 focus:border-[#3bc5a5] focus:border-2"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full h-12 bg-[#1bd78c] hover:bg-[#7add9d] text-black font-medium border-none shadow-sm"
            >
              {isPending ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Creating Account...
                </>
              ) : "Submit"}
            </Button>

            <div className="flex gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full h-12 border-gray-300 bg-transparent hover:bg-gray-100/50 text-black font-medium"
                disabled={isPending || isSuccess}
              >
                <Apple className="mr-2 h-5 w-5" />
                Apple
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full h-12 border-gray-300 bg-transparent hover:bg-gray-100/50 text-black font-medium"
                disabled={isPending || isSuccess}
                onClick={() => {
                  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
                }}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-8 flex justify-between text-sm">
          <div className="text-gray-600">
            Have any account?{" "}
            <Link to="/" className="text-gray-800 hover:underline">
              Sign in
            </Link>
          </div>
          <div>
            <Link to="/" className="text-gray-800 hover:underline">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-full md:w-1/2 relative hidden md:block h-screen p-4">
       
        <img
          src="/placeholder.jpg"
          alt="Team collaboration"
          className=" h-full w-full object-cover  border rounded-3xl "
        />
        

        {/* Calendar UI elements overlay - updated positioning and styling */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-[#f8dc69] rounded-2xl p-4 shadow-md max-w-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Task Review With Team</p>
                <p className="text-xs text-gray-700">09:30am-10:00am</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-black"></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-3 shadow-md max-w-xs mt-4 text-white">
            <p className="text-xs">09:30am-10:00am</p>
          </div>
        </div>

        {/* Calendar at the bottom - updated styling */}
        <div className="absolute bottom-40 right-10 z-20 bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg">
          <div className="grid grid-cols-7 gap-4 text-center">
            <div className="text-xs text-gray-500">Sun</div>
            <div className="text-xs text-gray-500">Mon</div>
            <div className="text-xs text-gray-500">Tue</div>
            <div className="text-xs text-gray-500">Wed</div>
            <div className="text-xs text-gray-500">Thu</div>
            <div className="text-xs text-gray-500">Fri</div>
            <div className="text-xs text-gray-500">Sat</div>

            <div className="text-sm font-medium">22</div>
            <div className="text-sm font-medium">23</div>
            <div className="text-sm font-medium">24</div>
            <div className="text-sm font-medium">25</div>
            <div className="text-sm font-medium">26</div>
            <div className="text-sm font-medium">27</div>
            <div className="text-sm font-medium">28</div>
          </div>
        </div>

        {/* Meeting card - updated styling */}
        <div className="absolute bottom-20 right-10 z-20 bg-white rounded-2xl p-4 shadow-md max-w-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Daily Meeting</p>
              <p className="text-xs text-gray-700">12:00pm-01:00pm</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
          </div>
          <div className="flex mt-3 -space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
              <img
                src="/placeholder.svg?height=32&width=32"
                width={32}
                height={32}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white overflow-hidden">
              <img
                src="/placeholder.svg?height=32&width=32"
                width={32}
                height={32}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white overflow-hidden">
              <img
                src="/placeholder.svg?height=32&width=32"
                width={32}
                height={32}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-white overflow-hidden">
              <img
                src="/placeholder.svg?height=32&width=32"
                width={32}
                height={32}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Add decorative elements on the right side */}
        <div className="absolute top-1/3 right-10 z-10">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md"></div>
        </div>
        <div className="absolute bottom-1/4 left-10 z-10">
          <div className="w-12 h-12 rounded-full bg-[#abd7cd]/30 backdrop-blur-md"></div>
        </div>
      </div>
    </div>
  )
}

