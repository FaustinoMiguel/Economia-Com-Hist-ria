import { Outlet } from 'react-router'
import Navbar from '../../styles/Navbar'
import Footer from '../../styles/Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
