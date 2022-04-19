import React from 'react'

import View from './views/index.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { LoadingProvider } from './hooks/useLoading.jsx'
import { ToastProvider } from './hooks/useToast.jsx'

function App() {
  return (
    <main className="flex min-h-full flex-col bg-gray-100">
      <div className="grid flex-grow">
        <div className="h-full">
          <ToastProvider>
            <LoadingProvider>
              <AuthProvider>
                <View />
              </AuthProvider>
            </LoadingProvider>
          </ToastProvider>
        </div>
      </div>
    </main>
  )
}

export default App
