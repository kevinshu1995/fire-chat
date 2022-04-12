import Loading from '/src/components/Loading.jsx'

import { createContext, useContext, useState } from 'react'

export const LoadingContext = createContext()

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const value = { setIsLoading }

  return (
    <LoadingContext.Provider value={value}>
      {isLoading ? <Loading /> : children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
