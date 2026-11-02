import { Outlet } from '@tanstack/react-router'
import Navbar from './components/NavBar'

const App = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default App