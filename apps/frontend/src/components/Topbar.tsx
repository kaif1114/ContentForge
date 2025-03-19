import { Bell, Search, User, Squirrel } from "lucide-react"
import { Input } from "@/components/ui/input"

export function TopBar() {
  return (
    <div className="bg-white rounded-full shadow-sm h-13 px-6 flex items-center justify-between">
      {/* Logo section */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-wayflyer-green flex items-center justify-center">
          <Squirrel size={35} className="stroke-[#45c19a]"/>
        </div>
        <span className="font-bold text-xl">contentforge</span>
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        <span className="text-md font-bold">Content Creation Made Easier</span>
      </div>

      {/* Search bar centered */}
      <div className="relative max-w-md w-full mx-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input className="pl-10 bg-gray-100 border-0 rounded-full h-8" placeholder="What are you looking for?" />
      </div>

      {/* User profile section */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">Kaif</span>
            <span className="text-xs text-gray-500">Muhammad Kaif</span>
          </div>
          <div className="text-gray-400 ml-1">▼</div>
        </div>
      </div>
    </div>
  )
}

