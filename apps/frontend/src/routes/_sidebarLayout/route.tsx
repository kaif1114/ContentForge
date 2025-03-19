import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/Topbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'


export const Route = createFileRoute('/_sidebarLayout')({
  component: SidebarLayout,
})

export default function SidebarLayout() {
  return (
     
      <div className="min-h-screen wayflyer-gradient font-inter  p-4">
        <TopBar />
        <div className="flex gap-4 mt-4">
          <Sidebar />
          <main className="flex-1 px-6 py-4">
            <Outlet/>
          </main>
        </div>
      </div>
    )

  
}


