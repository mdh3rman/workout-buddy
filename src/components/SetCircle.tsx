interface SetCircleProps {
  reps: number
  targetReps: number
  completedAt: string | null
  onTap: () => void
}

export function SetCircle({ reps, targetReps, completedAt, onTap }: SetCircleProps) {
  const isPending = completedAt === null
  const isFailed = !isPending && reps < targetReps

  const circleClass = isPending
    ? 'bg-zinc-800 border-2 border-dashed border-zinc-600'
    : isFailed
    ? 'bg-red-950 border-2 border-red-500'
    : 'bg-orange-500'

  const textClass = isPending
    ? 'text-zinc-400'
    : isFailed
    ? 'text-red-300'
    : 'text-white'

  return (
    <button
      onClick={onTap}
      className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform ${circleClass}`}
    >
      <span className={`font-extrabold text-xl leading-none ${textClass}`}>{reps}</span>
    </button>
  )
}
