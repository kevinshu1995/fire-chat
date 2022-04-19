import { createContext, useContext } from 'react'
import { ToastContainer, toast as reactToast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const ToastContext = createContext()

export function ToastProvider({ children }) {
  const toast = () => {
    return {
      info(msg, config) {
        reactToast.info(msg, config)
      },
      success(msg, config) {
        reactToast.success(msg, config)
      },
      warn(msg, config) {
        reactToast.warn(msg, config)
      },
      error(msg, config) {
        reactToast.error(msg, config)
      },
      default(msg, config) {
        reactToast(msg, config)
      },
    }
  }

  const value = { toast: toast() }

  return (
    <ToastContext.Provider value={value}>
      <ToastContainer />
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
