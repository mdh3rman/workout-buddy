import { useState } from 'react'

interface AdjustRepsModalProps {
  initialReps: number
  isWarmup: boolean
  onConfirm: (reps: number) => void
  onClose: () => void
}

export function AdjustRepsModal({ initialReps, isWarmup, onConfirm, onClose }: AdjustRepsModalProps) {
  const [reps, setReps] = useState(initialReps)

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="flex-1 bg-black/80" onClick={onClose} />
      <div className="bg-zinc-900 rounded-t-2xl p-6">
        <p className="text-white font-bold text-base text-center">Adjust Reps</p>
        {!isWarmup && (
          <p className="text-zinc-500 text-xs text-center mt-1">Subsequent incomplete sets will also be updated</p>
        )}
        <div className="flex items-center justify-center gap-10 my-8">
          <button
            onPointerDown={() => setReps(r => Math.max(1, r - 1))}
            className="w-14 h-14 rounded-full bg-zinc-800 text-zinc-300 text-3xl flex items-center justify-center active:scale-95 transition-transform"
          >
            −
          </button>
          <span className="text-white text-6xl font-extrabold min-w-[72px] text-center tabular-nums">
            {reps}
          </span>
          <button
            onPointerDown={() => setReps(r => r + 1)}
            className="w-14 h-14 rounded-full bg-zinc-800 text-zinc-300 text-3xl flex items-center justify-center active:scale-95 transition-transform"
          >
            +
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 text-white font-semibold py-3 rounded-xl text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reps)}
            className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
