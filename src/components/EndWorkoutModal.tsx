// src/components/EndWorkoutModal.tsx
import { useState } from 'react'
import { useWorkoutStore } from '../store/workoutStore'
import { savePlan, saveSession } from '../db/index'
import type { WorkoutSession, SessionExercise } from '../types'

function calcDuration(session: WorkoutSession): string {
  const ms = Date.now() - new Date(session.startedAt).getTime()
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0')
  const s = (totalSec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function calcVolume(exercises: SessionExercise[]): number {
  return exercises.reduce((total, ex) => {
    const reps = ex.sets.filter(s => s.completedAt !== null).reduce((sum, s) => sum + s.reps, 0)
    return total + reps * ex.weight
  }, 0)
}

interface Props { session: WorkoutSession; onClose: () => void }

export function EndWorkoutModal({ session, onClose }: Props) {
  const [planName, setPlanName] = useState('')
  const [saving, setSaving] = useState(false)
  const endSession = useWorkoutStore(s => s.endSession)

  const finish = async (saveAsPlan: boolean) => {
    setSaving(true)
    const completed = await endSession()
    if (saveAsPlan && planName.trim()) {
      const name = planName.trim()
      await saveSession({ ...completed, name })
      await savePlan({
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
        exercises: completed.exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: ex.targetSets,
          reps: ex.targetReps,
          weight: ex.weight,
        })),
      })
    }
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="flex-1 bg-black/80" onClick={() => !saving && onClose()} />
      <div className="bg-zinc-900 rounded-t-2xl p-6">
        <div className="text-center mb-6">
          <p className="text-4xl mb-2">🏁</p>
          <p className="text-white font-bold text-lg">Great workout!</p>
          <p className="text-zinc-500 text-sm mt-1">
            {calcDuration(session)} · {Math.round(calcVolume(session.exercises))} kg
          </p>
        </div>

        {!session.planId && (
          <div className="bg-zinc-800 rounded-xl p-4 mb-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-3">Save as plan?</p>
            <input
              type="text"
              placeholder="Plan name (e.g. Push Day A)"
              value={planName}
              onChange={e => setPlanName(e.target.value)}
              className="w-full bg-zinc-700 text-white text-sm rounded-lg px-3 py-2.5 outline-none placeholder:text-zinc-500 mb-3"
            />
            <button
              onClick={() => finish(true)}
              disabled={!planName.trim() || saving}
              className="w-full bg-orange-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-sm"
            >
              Save as Plan
            </button>
          </div>
        )}

        <button
          onClick={() => finish(false)}
          disabled={saving}
          className={`w-full text-sm py-2 ${session.planId ? 'bg-orange-500 text-white font-bold rounded-xl' : 'text-zinc-500'}`}
        >
          {session.planId ? 'Finish Workout' : "Don't save — just log it"}
        </button>
      </div>
    </div>
  )
}
