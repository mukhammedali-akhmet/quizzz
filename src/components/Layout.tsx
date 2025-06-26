import { Link, Outlet } from 'react-router-dom'
import Header from './Header'
import { Toaster } from 'sonner'

const Layout = () => {
  return (
    <>
      <Header />
      <main className='mt-[110px] mb-10 overflow-hidden'>
        <Outlet />
      </main>
      <Toaster theme="system" />
      <div className='fixed bottom-0 flex justify-end w-full py-2 px-2 bg-background'>
        <Link to="https://github.com/mukhammedali-akhmet/quizzz" className='text-neutral-400 hover:text-white'>Github</Link>
      </div>
    </>
  )
}

export default Layout