import { Outlet } from 'react-router-dom'
import Header from './Header'
import { Toaster } from 'sonner'

const Layout = () => {
  return (
    <>
        <Header />
        <main className='mt-[110px]'>
            <Outlet />
        </main>
        <Toaster />
    </>
  )
}

export default Layout