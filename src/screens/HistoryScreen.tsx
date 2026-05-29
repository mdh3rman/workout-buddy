// src/screens/HistoryScreen.tsx
import { useState, useEffect } from 'react'
import { getCompletedSessions } from '../db/index'
import { db } from '../db/index'
import type { WorkoutSession, SessionExercise } from '../types'

function calcDuration(session: WorkoutSession): string {
  if (!session.endedAt) return '--'
  const ms = new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()
  const m = Math.floor(ms / 60000).toString().padStart(2, '0')
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0')
  return `${m}:${s}`
}

function calcVolume(exercises: SessionExercise[]): number {
  return exercises.reduce((total, ex) => {
    const reps = ex.sets.filter(s => s.completedAt !== null).reduce((sum, s) => sum + s.reps, 0)
    return total + reps * ex.weight
  }, 0)
}

export function HistoryScreen() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [exerciseNames, setExerciseNames] = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    getCompletedSessions().then(setSessions)
    db.exercises.toArray().then(exs => setExerciseNames(Object.fromEntries(exs.map(e => [e.id, e.name]))))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-white font-extrabold text-xl mb-4 pt-2">History</h1>
      {sessions.length === 0 ? (
        <p className="text-zinc-600 text-sm text-center py-12">No completed workouts yet.</p>
      ) : (
        sessions.map(session => (
          <div key={session.id} className="bg-zinc-900 rounded-xl mb-3 overflow-hidden">
            <button
              className="w-full px-4 py-3 text-left"
              onClick={() => setExpanded(expanded === session.id ? null : session.id)}
            >
              <div className="flex justify-between items-start">
                <p className="text-white font-semibold">{session.name ?? 'Workout'}</p>
                <p className="text-zinc-500 text-xs">{new Date(session.startedAt).toLocaleDateString()}</p>
              </div>
              <p className="text-zinc-500 text-xs mt-0.5">
                {calcDuration(session)} · {Math.round(calcVolume(session.exercises))} kg
              </p>
            </button>
            {expanded === session.id && (
              <div className="border-t border-zinc-800 px-4 py-3">
                {session.exercises.map((ex, i) => (
                  <div key={i} className="mb-3">
                    <p className="text-zinc-300 text-sm font-medium mb-1">{exerciseNames[ex.exerciseId] ?? ex.exerciseId}</p>
                    <div className="flex gap-2 flex-wrap">
                      {ex.sets.map((set, si) => (
                        <div key={si} className={`text-xs px-2 py-1 rounded-lg ${set.completedAt ? 'bg-orange-500/20 text-orange-400' : 'bg-zinc-800 text-zinc-600'}`}>
                          {set.completedAt ? `${ex.weight > 0 ? `${ex.weight}kg` : 'BW'} ×${set.reps}` : 'skipped'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
