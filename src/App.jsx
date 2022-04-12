import React from 'react'

import View from './views/index.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { LoadingProvider } from './hooks/useLoading.jsx'

function App() {
  return (
    <main className="flex min-h-full flex-col bg-gray-100">
      <div className="grid flex-grow">
        <div className="h-full">
          <LoadingProvider>
            <AuthProvider>
              <View />
            </AuthProvider>
          </LoadingProvider>
        </div>
      </div>
    </main>
  )
}

export default App
