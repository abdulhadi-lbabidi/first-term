import { useEffect, useState } from 'react'

export function useCountUp(target: number, isActive: boolean, duration = 1800) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const startTime = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    const frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isActive, target, duration])

  return count
}
