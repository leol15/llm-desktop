import { Outlet } from 'react-router'
import { AppNavigation } from './components/AppNavigation'
import { FramHeader } from './components/FramHeader'

export default function AppWrapper() {
  return (
    <>
      <FramHeader />
      <div className="app">
        <AppNavigation />
        <Outlet />
      </div>
    </>
  )
}
