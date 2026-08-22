import { useEffect, useRef, useState } from 'react'

type ElementSize = {
  width: number
  height: number
}

export const useElementSize = () => {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<ElementSize>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return {
    elementRef,
    size,
  }
}
