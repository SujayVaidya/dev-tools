import { Outlet } from 'react-router-dom'
import { Nav } from '@/components/Nav'

export function Layout() {
  return (
    <div className="flex h-screen flex-col bg-[#0d0d0f]">
      <Nav />
      <div className="min-h-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
