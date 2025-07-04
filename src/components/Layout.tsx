import { Outlet } from 'react-router-dom'
import Header from './Header'
import { Toaster } from 'sonner'
import { SidebarProvider } from './ui/sidebar'
import AppSidebar from './AppSidebar'

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <Header />
        <main className='mt-[54.4px]'>
          <Outlet />
        </main>
      </div>
      <Toaster theme="system" />
    </SidebarProvider>
  )
}

export default Layout