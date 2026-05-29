// src/components/SetConfigSheet.tsx
import { useState } from 'react'
import { X } from 'lucide-react'
import { defaultWeight, adjustWeight, formatWeight } from '../lib/weight'
import type { Exercise } from '../types'

interface StepperProps {
  label: string
  display: string
  onDecrease: () => void
  onIncrease: () => void
}

function Stepper({ label, display, onDecrease, onIncrease }: StepperProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-zinc-400 text-sm">{label}</span>
      <div className="flex items-center gap-4">
        <button onClick={onDecrease} className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white text-lg">−</button>
        <span className="text-white font-bold text-base min-w-[60px] text-center">{display}</span>
        <button onClick={onIncrease} className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white text-lg">+</button>
      </div>
    </div>
  )
}

interface SetConfigSheetProps {
  exercise: Exercise
  onAdd: (sets: number, reps: number, weight: number) => void
  onClose: () => void
}

export function SetConfigSheet({ exercise, onAdd, onClose }: SetConfigSheetProps) {
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(8)
  const [weight, setWeight] = useState(defaultWeight(exercise.type))

  return (
    <div className="fixed inset-0 z-40 flex flex-col">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div className="bg-zinc-900 rounded-t-2xl p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-base">{exercise.name}</h2>
            <p className="text-zinc-500 text-xs capitalize">{exercise.type}</p>
          </div>
          <button onClick={onClose}><X size={20} className="text-zinc-400" /></button>
        </div>
        <div className="flex flex-col gap-5 mb-6">
          <Stepper label="Sets" display={String(sets)}
            onDecrease={() => setSets(s => Math.max(1, s - 1))}
            onIncrease={() => setSets(s => Math.min(20, s + 1))}
          />
          <Stepper label="Reps" display={String(reps)}
            onDecrease={() => setReps(r => Math.max(1, r - 1))}
            onIncrease={() => setReps(r => Math.min(50, r + 1))}
          />
          {exercise.type !== 'bodyweight' && (
            <Stepper label="Weight" display={formatWeight(weight, exercise.type)}
              onDecrease={() => setWeight(w => adjustWeight(w, exercise.type, -1))}
              onIncrease={() => setWeight(w => adjustWeight(w, exercise.type, 1))}
            />
          )}
        </div>
        <button
          onClick={() => onAdd(sets, reps, weight)}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl"
        >
          Add to Workout
        </button>
      </div>
    </div>
  )
}
