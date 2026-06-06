import { useRef } from 'react'

interface SetCircleProps {
  reps: number
  targetReps: number
  completedAt: string | null
  onTap: () => void
  onLongPress?: () => void
  isWarmup?: boolean
}

export function SetCircle({ reps, targetReps, completedAt, onTap, onLongPress, isWarmup }: SetCircleProps) {
  const isPending = completedAt === null
  const isFailed = !isPending && reps < targetReps

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didLongPressRef = useRef(false)

  const handlePointerDown = () => {
    if (!onLongPress) return
    didLongPressRef.current = false
    timerRef.current = setTimeout(() => {
      didLongPressRef.current = true
      onLongPress()
    }, 500)
  }

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handleClick = () => {
    if (didLongPressRef.current) return
    onTap()
  }

  let circleClass: string
  let textClass: string

  if (isWarmup) {
    circleClass = isPending
      ? 'bg-zinc-800 border-2 border-dashed border-zinc-600'
      : 'bg-zinc-700'
    textClass = isPending ? 'text-zinc-500' : 'text-zinc-300'
  } else {
    circleClass = isPending
      ? 'bg-zinc-800 border-2 border-dashed border-zinc-600'
      : isFailed
      ? 'bg-red-950 border-2 border-red-500'
      : 'bg-orange-500'
    textClass = isPending
      ? 'text-zinc-400'
      : isFailed
      ? 'text-red-300'
      : 'text-white'
  }

  return (
    <button
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform ${circleClass}`}
    >
      <span className={`font-extrabold text-xl leading-none ${textClass}`}>
        {isWarmup && isPending ? 'W' : reps}
      </span>
    </button>
  )
}
