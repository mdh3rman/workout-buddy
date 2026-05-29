// src/components/EndWorkoutModal.tsx
import type { WorkoutSession } from '../types'
interface Props { session: WorkoutSession; onClose: () => void }
export function EndWorkoutModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end" onClick={onClose}>
      <div className="bg-zinc-900 w-full rounded-t-2xl p-6">
        <p className="text-white font-bold text-center">End Workout</p>
        <p className="text-zinc-500 text-sm text-center mt-2">(Full implementation coming in Task 12)</p>
      </div>
    </div>
  )
}
