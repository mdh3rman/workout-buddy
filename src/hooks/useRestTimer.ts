import { useEffect } from 'react'
import { useWorkoutStore } from '../store/workoutStore'

export function useRestTimer() {
  const isActive = useWorkoutStore(s => s.restTimer.isActive)
  const tickRest = useWorkoutStore(s => s.tickRest)

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(tickRest, 1000)
    return () => clearInterval(interval)
  }, [isActive, tickRest])
}
