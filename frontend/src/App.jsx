import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from "./pages/Dashboard";

function App() {
  const approuter=createBrowserRouter([
    {
      path:"/",
      element:<LandingPage/>
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/dashboard",
      element: <Dashboard />
    }
  ])

  return (
    <>

    <RouterProvider router ={approuter}/>
     
    </>
  )
}

export default App
