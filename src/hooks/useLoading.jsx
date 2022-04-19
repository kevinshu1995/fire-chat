import Loading from '/src/components/Loading.jsx'
import { Transition } from '@headlessui/react'

import { createContext, useContext, useState } from 'react'

export const LoadingContext = createContext()

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const value = { isLoading, setIsLoading }

  return (
    <LoadingContext.Provider value={value}>
      <Transition
        show={isLoading === true}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Loading />
      </Transition>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
