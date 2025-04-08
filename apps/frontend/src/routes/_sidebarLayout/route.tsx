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
     
      <div className="min-h-screen font-inter py-2 px-8" style={{ background: 'linear-gradient(to bottom, #E1F2EC, #F7FEFC)' }}>
        <TopBar />
        <div className="flex gap-4 mt-4">
          <Sidebar />
          <main className="flex-1 flex sm:px-5 py-4">
            <Outlet/>
          </main>
        </div>
      </div>
    )

  
}


