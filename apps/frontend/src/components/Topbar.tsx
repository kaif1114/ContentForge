import { Bell, User, Squirrel, Settings, LogOut, Loader2, AlertCircle, Menu } from "lucide-react"
import { Link } from "@tanstack/react-router"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import api from "@/utils/axios"
import useUser from "@/hooks/useUser"
import { useState } from "react"

export function TopBar() {
  const { data: user, isError, error, isLoading } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    localStorage.removeItem("access")
    localStorage.removeItem("user")
    try {
      await api.get("/auth/logout")
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="rounded-full h-auto py-3 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-y-3 ">
      {/* Mobile menu toggle */}
      <button 
        className="block sm:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Logo section */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-wayflyer-green flex items-center justify-center">
          <Squirrel size={28} className="stroke-[#45c19a] sm:h-[35px] sm:w-[35px]" />
        </div>
        <span className="font-bold text-lg sm:text-xl">contentforge</span>
        <div className="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>
        <span className="hidden md:block text-sm sm:text-md font-bold">Content Creation Made Easier</span>
      </div>

      {/* User profile section */}
      <div className="flex items-center gap-3 max-[430px]:hidden">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
            <div className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-white">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isError ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              {isLoading ? (
                <span className="text-sm font-bold">Loading...</span>
              ) : isError ? (
                <span className="text-sm font-bold text-red-500">Error</span>
              ) : (
                <>
                  <span className="text-sm font-bold">{user?.name ?? "N/A"}</span>
                  <span className="text-xs text-gray-500">{user?.email ?? "N/A"}</span>
                </>
              )}
            </div>
            <div className="text-gray-400 ml-1">▼</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {!isLoading && !isError && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </>
            )}
            {isError && (
              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>Failed to load user data</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile menu - conditionally rendered */}
      {mobileMenuOpen && (
        <div className="w-full sm:hidden mt-2 bg-white py-3 px-4 rounded-lg shadow-md">
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 py-2 text-gray-700 hover:text-cf-primary-green">
              <span>Dashboard</span>
            </Link>
            <Link to="/posts" className="flex items-center gap-2 py-2 text-gray-700 hover:text-cf-primary-green">
              <span>Posts</span>
            </Link>
            <Link to="/sources" className="flex items-center gap-2 py-2 text-gray-700 hover:text-cf-primary-green">
              <span>Sources</span>
            </Link>
            <Link to="/topics" className="flex items-center gap-2 py-2 text-gray-700 hover:text-cf-primary-green">
              <span>Topics</span>
            </Link>
            <Link to="/settings" className="flex items-center gap-2 py-2 text-gray-700 hover:text-cf-primary-green">
              <span>Settings</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

