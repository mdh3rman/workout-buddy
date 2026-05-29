import { useState } from 'react'
import { X, Trash2, Plus } from 'lucide-react'
import { savePlan } from '../db/index'
import { ExercisePicker } from './ExercisePicker'
import { SetConfigSheet } from './SetConfigSheet'
import type { Exercise, PlanExercise } from '../types'

interface Props {
  onSaved: () => void
  onClose: () => void
}

export function CreatePlanSheet({ onSaved, onClose }: Props) {
  const [name, setName] = useState('')
  const [exercises, setExercises] = useState<PlanExercise[]>([])
  const [exerciseLabels, setExerciseLabels] = useState<Record<string, string>>({})
  const [showPicker, setShowPicker] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [saving, setSaving] = useState(false)

  const handleAdd = (sets: number, reps: number, weight: number) => {
    if (!selectedExercise) return
    setExercises(prev => [...prev, { exerciseId: selectedExercise.id, sets, reps, weight }])
    setExerciseLabels(prev => ({ ...prev, [selectedExercise.id]: selectedExercise.name }))
    setSelectedExercise(null)
  }

  const handleRemove = (idx: number) => {
    setExercises(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    if (!name.trim() || exercises.length === 0) return
    setSaving(true)
    await savePlan({
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      exercises,
    })
    setSaving(false)
    onSaved()
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex flex-col">
        <div className="flex-1 bg-black/60" onClick={onClose} />
        <div className="bg-zinc-900 rounded-t-2xl flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800 shrink-0">
            <h2 className="text-white font-bold text-base">New Plan</h2>
            <button onClick={onClose}><X size={20} className="text-zinc-400" /></button>
          </div>

          <div className="overflow-y-auto flex-1 p-4">
            {/* Plan name */}
            <input
              type="text"
              placeholder="Plan name (e.g. Push Day A)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-800 text-white text-sm rounded-xl px-4 py-3 outline-none placeholder:text-zinc-500 mb-4"
            />

            {/* Exercise list */}
            {exercises.length > 0 && (
              <div className="mb-4 flex flex-col gap-2">
                {exercises.map((pe, i) => (
                  <div key={i} className="bg-zinc-800 rounded-xl px-4 py-3 flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm font-semibold">{exerciseLabels[pe.exerciseId] ?? pe.exerciseId}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {pe.sets} sets × {pe.reps} reps{pe.weight > 0 ? ` @ ${pe.weight}kg` : ' · BW'}
                      </p>
                    </div>
                    <button onClick={() => handleRemove(i)}>
                      <Trash2 size={15} className="text-zinc-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add exercise */}
            <button
              onClick={() => setShowPicker(true)}
              className="w-full border-2 border-dashed border-zinc-700 rounded-xl py-3 text-orange-500 font-semibold text-sm flex items-center justify-center gap-2 mb-4"
            >
              <Plus size={16} /> Add Exercise
            </button>
          </div>

          {/* Save button */}
          <div className="px-4 pb-6 pt-2 shrink-0 border-t border-zinc-800">
            <button
              onClick={handleSave}
              disabled={!name.trim() || exercises.length === 0 || saving}
              className="w-full bg-orange-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm"
            >
              Save Plan
            </button>
          </div>
        </div>
      </div>

      {showPicker && (
        <ExercisePicker
          onSelect={ex => { setSelectedExercise(ex); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {selectedExercise && (
        <SetConfigSheet
          exercise={selectedExercise}
          onAdd={handleAdd}
          onClose={() => setSelectedExercise(null)}
          addLabel="Add to Plan"
        />
      )}
    </>
  )
}
