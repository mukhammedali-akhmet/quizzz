import { createRoot } from 'react-dom/client'
import './index.css'
import "./i18n/index.ts"
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Home from "./pages/Home.tsx"
import { ThemeProvider } from './components/ThemeProvider.tsx'
import QuizPlay from './pages/QuizPlay.tsx'
import LogIn from './pages/LogIn.tsx'
import ResetPassword from './pages/ResetPassword.tsx'
import CreateRedirect from './pages/CreateRedirect.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/create", element: <CreateRedirect /> },
      { path: "/login", element: <LogIn /> },
      { path: "/reset", element: <ResetPassword /> },
      { path: "/quiz/:id", element: <QuizPlay /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </Provider>
)
