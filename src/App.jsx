import React from 'react'

import View from './routes/index.jsx'

function App() {
  return (
    <main className="flex min-h-full flex-col bg-gray-100">
      <div className="grid flex-grow">
        <div className="h-full">
          <View />
        </div>
      </div>
    </main>
  )
}

export default App
