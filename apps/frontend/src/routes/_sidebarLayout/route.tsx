import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Sidebar } from "@/components/sidebar"

export const Route = createFileRoute('/_sidebarLayout')({
  component: SidebarLayout,
})

export default function SidebarLayout() {
  return (
          <div className="flex min-h-screen bg-[#e8f0f0]">
            <Sidebar />
            <Outlet/>
          </div>

  )
}


