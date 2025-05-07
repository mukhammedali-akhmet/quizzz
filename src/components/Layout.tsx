import { Outlet } from 'react-router-dom'
import Header from './Header'

const Layout = () => {
  return (
    <>
        <Header />
        <main className='mt-[110px]'>
            <Outlet />
        </main>
    </>
  )
}

export default Layout