// src/screens/HomeScreen.tsx
import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'
import { useWorkoutStore } from '../store/workoutStore'
import { getPlans, updatePlanLastUsed } from '../db/index'
import { buildSessionExercises } from '../lib/warmup'
import type { WorkoutPlan } from '../types'

function formatRelativeDate(iso: string | null): string {
  if (!iso) return 'never'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days}d ago`
}

function calcResumeDuration(startedAt: string): string {
  const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
  const m = Math.floor(elapsed / 60).toString().padStart(2, '0')
  const s = (elapsed % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function HomeScreen() {
  const activeSession = useWorkoutStore(s => s.activeSession)
  const startSession = useWorkoutStore(s => s.startSession)
  const setScreen = useWorkoutStore(s => s.setScreen)
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [exerciseNames, setExerciseNames] = useState<Record<string, string>>({})
  const [duration, setDuration] = useState('')
  const sessionStartedAt = activeSession?.startedAt

  useEffect(() => {
    getPlans().then(setPlans)
    db.exercises.toArray().then(exs => {
      setExerciseNames(Object.fromEntries(exs.map(e => [e.id, e.name])))
    })
  }, [])

  useEffect(() => {
    if (!sessionStartedAt) return
    const tick = () => setDuration(calcResumeDuration(sessionStartedAt))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [sessionStartedAt])

  const startFromPlan = async (plan: WorkoutPlan) => {
    await updatePlanLastUsed(plan.id)
    const exercises = await buildSessionExercises(plan.exercises)
    startSession(plan.id, plan.name, exercises)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-white font-extrabold text-xl">Workout Buddy</h1>
        <p className="text-zinc-500 text-sm">{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
      </div>

      {activeSession ? (
        <div className="border-2 border-orange-500 rounded-2xl bg-zinc-900 p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-white font-bold">{activeSession.name ?? 'Workout in progress'}</p>
            <p className="text-orange-500 font-bold text-sm">{duration}</p>
          </div>
          <button
            onClick={() => setScreen('active-workout')}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Play size={16} className="fill-white" /> Resume Workout
          </button>
          <div className="mt-3 flex flex-col gap-1.5">
            {activeSession.exercises.map((ex, i) => {
              const done = ex.sets.filter(s => s.completedAt !== null).length
              const isActive = done > 0 && done < ex.targetSets
              const isDone = done === ex.targetSets
              return (
                <div key={i} className="flex justify-between items-center">
                  <p className={`text-sm ${isDone ? 'text-emerald-500' : isActive ? 'text-orange-500 font-semibold' : 'text-zinc-600'}`}>
                    {exerciseNames[ex.exerciseId] ?? ex.exerciseId}
                  </p>
                  <p className={`text-xs ${isDone ? 'text-emerald-500' : isActive ? 'text-orange-500' : 'text-zinc-700'}`}>
                    {isDone ? '✓ Done' : isActive ? 'In progress' : 'Pending'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => startSession()}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mb-6 text-base"
        >
          <Play size={18} className="fill-white" /> Start New Workout
        </button>
      )}

      {!activeSession && (
        <div>
          <p className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-3">Saved Plans</p>
          {plans.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-8">No saved plans yet. Start a workout and save it!</p>
          ) : (
            plans.map(plan => (
              <div key={plan.id} className="bg-zinc-900 rounded-xl px-4 py-3 mb-2 flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold text-sm">{plan.name}</p>
                  <p className="text-zinc-500 text-xs">{plan.exercises.length} exercises · last done {formatRelativeDate(plan.lastUsedAt)}</p>
                </div>
                <button
                  onClick={() => startFromPlan(plan)}
                  className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                >
                  GO
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
