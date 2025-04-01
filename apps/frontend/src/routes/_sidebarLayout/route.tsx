import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/Topbar'
import { checkAuth } from '@/utils/auth'
import { createFileRoute, Outlet } from '@tanstack/react-router'


export const Route = createFileRoute('/_sidebarLayout')({
  component: SidebarLayout,
  beforeLoad: async ({ location }) => {
    await checkAuth(location.href)
  }
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


