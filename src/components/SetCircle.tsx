interface SetCircleProps {
  reps: number
  targetReps: number
  completedAt: string | null
  onTap: () => void
  isWarmup?: boolean
}

export function SetCircle({ reps, targetReps, completedAt, onTap, isWarmup }: SetCircleProps) {
  const isPending = completedAt === null
  const isFailed = !isPending && reps < targetReps

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
      onClick={onTap}
      className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform ${circleClass}`}
    >
      <span className={`font-extrabold text-xl leading-none ${textClass}`}>
        {isWarmup && isPending ? 'W' : reps}
      </span>
    </button>
  )
}
