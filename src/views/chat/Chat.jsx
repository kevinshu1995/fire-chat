import { Outlet } from 'react-router-dom'

export default function Chat() {
  return (
    <>
      <nav className="sticky top-0 left-0 w-full shadow">
        <div className="flex gap-4 py-4 px-4">
          <h1 className="font-bold">Real Chat</h1>
          <div className="flex">
            <div>
              <h2>Public chat</h2>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  )
}
