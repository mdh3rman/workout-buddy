// src/screens/PlansScreen.tsx
import { useState, useEffect } from 'react'
import { Trash2, Plus, Pencil } from 'lucide-react'
import { getPlans, deletePlan, updatePlanLastUsed, db } from '../db/index'
import { useWorkoutStore } from '../store/workoutStore'
import { CreatePlanSheet } from '../components/CreatePlanSheet'
import type { WorkoutPlan, SessionExercise } from '../types'

export function PlansScreen() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [exerciseNames, setExerciseNames] = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null)
  const startSession = useWorkoutStore(s => s.startSession)

  const load = () => {
    getPlans().then(setPlans)
    db.exercises.toArray().then(exs => setExerciseNames(Object.fromEntries(exs.map(e => [e.id, e.name]))))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    await deletePlan(id)
    load()
  }

  const startFromPlan = async (plan: WorkoutPlan) => {
    await updatePlanLastUsed(plan.id)
    const exercises: SessionExercise[] = plan.exercises.map(pe => ({
      exerciseId: pe.exerciseId,
      targetSets: pe.sets,
      targetReps: pe.reps,
      weight: pe.weight,
      sets: Array.from({ length: pe.sets }, () => ({ reps: pe.reps, completedAt: null })),
    }))
    startSession(plan.id, plan.name, exercises)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 pt-2">
        <h1 className="text-white font-extrabold text-xl">Plans</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-lg"
        >
          <Plus size={14} /> New Plan
        </button>
      </div>
      {plans.length === 0 ? (
        <p className="text-zinc-600 text-sm text-center py-12">No saved plans yet.</p>
      ) : (
        plans.map(plan => (
          <div key={plan.id} className="bg-zinc-900 rounded-xl mb-3 overflow-hidden">
            <div className="px-4 py-3 flex justify-between items-center">
              <button className="flex-1 text-left" onClick={() => setExpanded(expanded === plan.id ? null : plan.id)}>
                <p className="text-white font-semibold">{plan.name}</p>
                <p className="text-zinc-500 text-xs">{plan.exercises.length} exercises</p>
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => startFromPlan(plan)} className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Start</button>
                <button onClick={() => setEditingPlan(plan)}><Pencil size={16} className="text-zinc-500" /></button>
                <button onClick={() => handleDelete(plan.id)}><Trash2 size={16} className="text-zinc-600" /></button>
              </div>
            </div>
            {expanded === plan.id && (
              <div className="border-t border-zinc-800 px-4 py-3">
                {plan.exercises.map((pe, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-zinc-800/50 last:border-0">
                    <p className="text-zinc-300 text-sm">{exerciseNames[pe.exerciseId] ?? pe.exerciseId}</p>
                    <p className="text-zinc-500 text-xs">{pe.sets}×{pe.reps} @ {pe.weight > 0 ? `${pe.weight}kg` : 'BW'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
      {showCreate && (
        <CreatePlanSheet
          onSaved={() => { setShowCreate(false); load() }}
          onClose={() => setShowCreate(false)}
        />
      )}
      {editingPlan && (
        <CreatePlanSheet
          plan={editingPlan}
          onSaved={() => { setEditingPlan(null); load() }}
          onClose={() => setEditingPlan(null)}
        />
      )}
    </div>
  )
}
