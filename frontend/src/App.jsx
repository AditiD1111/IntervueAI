import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

function App() {
  const approuter=createBrowserRouter([
    {
      path:"/",
      element:<LandingPage/>
    }
  ])
  

  return (
    <>

    <RouterProvider router ={approuter}/>
     
    </>
  )
}

export default App
