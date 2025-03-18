import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Link } from '@tanstack/react-router'

// Custom filled icons
const FilledIcons = {
  Grid: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z" />
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
    </svg>
  ),
  Document: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  ),
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  ),
  Headphones: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  ),
  Logo: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M3 5.5L5 3.5M5 3.5L7 5.5M5 3.5V9M12 3.5L14 5.5M14 5.5L16 3.5M14 5.5V9M7 12.5L5 14.5M5 14.5L3 16.5M5 14.5V20M16 12.5L14 14.5M14 14.5L12 16.5M14 14.5V20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Mute: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M3 8.5L3 15.5M8.5 3L15.5 3M21 8.5V15.5M8.5 21H15.5M12 12H12.01M21 3L3 21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

const navItems = [
  { icon: FilledIcons.Grid, label: "Dashboard", active: true, href: "/home"  },
  { icon: FilledIcons.Mail, label: "Messages", href: "/messages"  },
  { icon: FilledIcons.Document, label: "Documents", href: "/about"  },
  { icon: FilledIcons.Send, label: "Send", href: "/home"  },
  { icon: FilledIcons.Clock, label: "History", href: "/home"  },
  { icon: FilledIcons.Headphones, label: "Support", href: "/home"  },
  { icon: FilledIcons.Settings, label: "Settings", href: "/home"  },
]

export function Sidebar() {
  const [activeItem, setActiveItem] = useState(0)

  return (
    <aside className="flex flex-col items-center w-16 py-6 gap-6">
      <div className="flex flex-col items-center gap-6 flex-1">
        <div className="flex items-center justify-center w-10 h-10">
          <FilledIcons.Logo />
        </div>

        <nav className="flex flex-col items-center gap-5">
          {navItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="relative group">
                <Link
                to={item.href}
                  className={cn(
                    "group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                    index === activeItem
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-black hover:text-white",
                  )}
                  onClick={() => setActiveItem(index)}
                >
                  <span className="transform transition-transform duration-300 group-hover:scale-110">
                    <Icon />
                  </span>
                </Link>

                {/* Navigation Label Tooltip */}
                <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-sm py-1 px-3 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-10">
                  {item.label}
                  {/* Triangle pointer */}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-black"></div>
                </div>
              </div>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto flex flex-col items-center gap-5">
        <Avatar className="w-10 h-10 border-2 border-white">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="relative group">
          <button className="group flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-black hover:text-white transition-all duration-300">
            <span className="transform transition-transform duration-300 group-hover:scale-110">
              <FilledIcons.Mute />
            </span>
          </button>

          {/* Navigation Label Tooltip */}
          <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-sm py-1 px-3 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-10">
            Mute Notifications
            {/* Triangle pointer */}
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-black"></div>
          </div>
        </div>
      </div>
    </aside>
  )
}

