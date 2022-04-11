import React from 'react'

import View from './views/index.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'

function App() {
  return (
    <main className="flex min-h-full flex-col bg-gray-100 text-gray-800">
      <div className="grid flex-grow">
        <div className="h-full">
          <AuthProvider>
            <View />
          </AuthProvider>
        </div>
      </div>
    </main>
  )
}

export default App
