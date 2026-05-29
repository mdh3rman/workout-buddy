import { useWorkoutStore } from '../store/workoutStore'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function RestTimerBar() {
  const restTimer = useWorkoutStore(s => s.restTimer)
  const skipRest = useWorkoutStore(s => s.skipRest)
  const addRestTime = useWorkoutStore(s => s.addRestTime)

  if (!restTimer.isActive) return null

  const progress = restTimer.secondsRemaining / restTimer.totalSeconds

  return (
    <div className="fixed bottom-16 left-0 right-0 z-10 bg-orange-950 border-t-2 border-orange-500 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-zinc-400 text-[9px] uppercase tracking-wider leading-none mb-1">Resting</p>
          <p className="text-orange-500 text-2xl font-extrabold tracking-widest leading-none">
            {formatTime(restTimer.secondsRemaining)}
          </p>
        </div>
        <div className="flex-1">
          <div className="bg-orange-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => addRestTime(30)}
            className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1.5 rounded-lg"
          >
            +30s
          </button>
          <button
            onClick={skipRest}
            className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
