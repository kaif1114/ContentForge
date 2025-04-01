import type React from "react"
import { Lightbulb, CreditCard, BookOpen, BarChart3, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
}

const topNavigation = [{
  icon: <Lightbulb className="w-5 h-5 text-green-600" />,
  label: "Sources",
  active: true,
  href: "/sources",
},
{
  icon: <CreditCard className="w-5 h-5 text-green-600" />,
  label: "Posts",
  active: false,
  href: "/Posts",
},
{
  icon: <BookOpen className="w-5 h-5 text-green-600" />,
  label: "Topics",
  active: false,
  href: "/topics",
},
]

const bottomNavigation = [{
 icon: <div className="w-5 h-5 bg-purple-500 rounded-full" />, label:"Chartly", active: false,
  href: "/chartly",
},
{
  icon: 
    <div className="w-5 h-5 bg-red-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
      N
    </div>,
  
  label:"Newstand",
  active: false,
  href: "/newstand",
},
{
icon:<BarChart3 className="w-5 h-5 text-yellow-500" />,
 label:"Golden Bar",
active: false,
}
]

function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  const activeStyle = {
    background: '#DEF0EA'
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-200",
      )}
      style={active ? activeStyle : undefined}
      onMouseOver={(e) => !active && (e.currentTarget.style.background = '#DEF0EA')}
      onMouseOut={(e) => !active && (e.currentTarget.style.background = '')}
    >
      <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="w-[240px] h-fit rounded-3xl shadow-sm p-4 flex flex-col" style={{ backgroundColor: '#EEF8F5' }}>
      <div className="px-4 py-2 text-xs font-semibold text-gray-500">APPS</div>

      <div className="mt-2 space-y-1">
       {topNavigation.map((item) => (
        <Link to={item.href} key={item.label}><SidebarItem  {...item}  /></Link>
       ))}


        <div className="border-t my-2 border-gray-100" />
        {
          bottomNavigation.map((item) => (
            <Link to={item.href} key={item.label} ><SidebarItem {...item}  /></Link>
          ))
        }

      </div>
    </div>
  )
}

