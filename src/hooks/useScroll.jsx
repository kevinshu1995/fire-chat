import { useRef, useEffect } from 'react'

export function useScroll({ refToScroll, stateToWatch, scrollOptions }) {
  const scrollRef = useRef()

  const scrollToBottom = (time) => {
    refToScroll.current?.scrollIntoView({
      behavior: 'smooth',
      ...scrollOptions,
    })
  }

  useEffect(() => {
    scrollRef.current = requestAnimationFrame(scrollToBottom)
    return () => cancelAnimationFrame(scrollRef.current)
  }, [stateToWatch])
}
