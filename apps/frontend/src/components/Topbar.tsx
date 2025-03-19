import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function TopBar() {
  return (
    <div className="bg-white rounded-full shadow-sm h-13 px-6 flex items-center">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-wayflyer-green flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.42,0-8-3.58-8-8 s3.58-8,8-8s8,3.58,8,8S16.42,20,12,20z M12,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S15.31,6,12,6z M12,16 c-2.21,0-4-1.79-4-4s1.79-4,4-4s4,1.79,4,4S14.21,16,12,16z" />
          </svg>
        </div>
        <span className="font-bold text-xl">wayflyer</span>
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        <span className="text-xl">Financing</span>
      </div>

      <div className="ml-auto relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input className="pl-10 bg-gray-100 border-0 rounded-full h-10" placeholder="What are you looking for?" />
      </div>
    </div>
  )
}

