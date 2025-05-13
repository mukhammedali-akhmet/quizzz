import { Link, Outlet } from 'react-router-dom'
import Header from './Header'
import LogInForm from './LogInForm'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store'
import { toggleModal } from '@/features/modal/modalSlice'
import { Toaster } from 'sonner'

const Layout = () => {
  const modal = useSelector((state: RootState) => state.modal);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <Header />
      <main className='mt-[110px]'>
        <Outlet />
      </main>
      {user.username ? null : (
        <>
          <LogInForm />
          <div onClick={() => dispatch(toggleModal())} className={`fixed inset-0 bg-black/50 z-[98] transition-opacity duration-200 ${modal ? "opacity-100" : "opacity-0 scale-0"}`} />
        </>
      )}
      <Toaster theme="system" />
      <div className='fixed bottom-0 flex justify-end w-full py-2 px-2 bg-background'>
        <Link to="https://github.com/mukhammedali-akhmet/quizzz" className='text-neutral-400 hover:text-white'>Github</Link>
      </div>
    </>
  )
}

export default Layout