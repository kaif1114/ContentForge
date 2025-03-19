import type React from "react"
import { Lightbulb, CreditCard, BookOpen, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
}

function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer",
        active ? "bg-gray-50" : "hover:bg-gray-50",
      )}
    >
      <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="w-[240px] bg-white rounded-3xl shadow-sm p-4 flex flex-col">
      <div className="px-4 py-2 text-xs font-semibold text-gray-500">APPS</div>

      <div className="mt-2 space-y-1">
        <SidebarItem icon={<Lightbulb className="w-5 h-5 text-green-600" />} label="Insights" active />

        <SidebarItem icon={<CreditCard className="w-5 h-5 text-green-600" />} label="Cards" />

        <SidebarItem icon={<BookOpen className="w-5 h-5 text-red-800" />} label="Booking" />

        <div className="border-t my-2 border-gray-100" />

        <SidebarItem
          icon={
            <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
              S
            </div>
          }
          label="Sales Expert"
        />

        <SidebarItem icon={<div className="w-5 h-5 bg-purple-500 rounded-full" />} label="Chartly" />

        <SidebarItem
          icon={
            <div className="w-5 h-5 bg-red-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
              N
            </div>
          }
          label="Newstand"
        />

        <SidebarItem icon={<BarChart3 className="w-5 h-5 text-yellow-500" />} label="Golden Bar" />
      </div>
    </div>
  )
}

