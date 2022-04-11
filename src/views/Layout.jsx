import { Outlet } from 'react-router-dom'

import Navigation from '/src/components/Navigation.jsx'

export default function Home() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  )
}
