// src/screens/ExerciseLibraryScreen.tsx
import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { db, getCompletedSessions } from '../db/index'
import type { Exercise, ExerciseType, MuscleGroup, WorkoutSession } from '../types'

type FilterType = ExerciseType | 'all'

const EXERCISE_TYPES: ExerciseType[] = ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight']
const MUSCLE_GROUPS: MuscleGroup[] = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'full body']

function NewExerciseSheet({ onSaved, onClose }: { onSaved: () => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [type, setType] = useState<ExerciseType>('barbell')
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('chest')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    await db.exercises.add({
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      muscleGroup,
    })
    setSaving(false)
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div className="bg-zinc-900 rounded-t-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
          <h2 className="text-white font-bold text-base">New Exercise</h2>
          <button onClick={onClose}><X size={20} className="text-zinc-400" /></button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Exercise name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-zinc-800 text-white text-sm rounded-xl px-4 py-3 outline-none placeholder:text-zinc-500"
          />
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {EXERCISE_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${
                    type === t ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold mb-2">Muscle Group</p>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map(g => (
                <button
                  key={g}
                  onClick={() => setMuscleGroup(g)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${
                    muscleGroup === g ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 pb-6 pt-2 border-t border-zinc-800">
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="w-full bg-orange-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm"
          >
            Save Exercise
          </button>
        </div>
      </div>
    </div>
  )
}

export function ExerciseLibraryScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [selected, setSelected] = useState<Exercise | null>(null)
  const [history, setHistory] = useState<WorkoutSession[]>([])
  const [showNew, setShowNew] = useState(false)

  const load = () => db.exercises.toArray().then(exs =>
    setExercises(exs.sort((a, b) => a.name.localeCompare(b.name)))
  )

  useEffect(() => { load() }, [])

  const filtered = exercises.filter(ex => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || ex.type === filter
    return matchSearch && matchFilter
  })

  const handleSelect = async (ex: Exercise) => {
    setSelected(ex)
    const sessions = await getCompletedSessions()
    setHistory(sessions.filter(s => s.exercises.some(e => e.exerciseId === ex.id)))
  }

  const chips: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Barbell', value: 'barbell' },
    { label: 'Dumbbell', value: 'dumbbell' },
    { label: 'Cable', value: 'cable' },
    { label: 'Machine', value: 'machine' },
    { label: 'Body', value: 'bodyweight' },
  ]

  if (selected) {
    return (
      <div className="p-4">
        <button onClick={() => setSelected(null)} className="text-orange-500 text-sm mb-4">← Back</button>
        <h1 className="text-white font-extrabold text-xl mb-1">{selected.name}</h1>
        <p className="text-zinc-500 text-sm capitalize mb-4">{selected.type} · {selected.muscleGroup}</p>
        <p className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-3">History</p>
        {history.length === 0 ? (
          <p className="text-zinc-600 text-sm">No history yet for this exercise.</p>
        ) : (
          history.map(session => {
            const ex = session.exercises.find(e => e.exerciseId === selected.id)!
            return (
              <div key={session.id} className="bg-zinc-900 rounded-xl p-3 mb-3">
                <p className="text-zinc-400 text-xs mb-2">{new Date(session.startedAt).toLocaleDateString()}</p>
                <div className="flex gap-2 flex-wrap">
                  {ex.sets.filter(s => s.completedAt).map((set, i) => (
                    <span key={i} className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-lg">
                      {ex.weight > 0 ? `${ex.weight}kg` : 'BW'} ×{set.reps}
                    </span>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 pt-2">
        <h1 className="text-white font-extrabold text-xl">Exercises</h1>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-lg"
        >
          <Plus size={14} /> New
        </button>
      </div>
      <input
        type="text"
        placeholder="Search exercises..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-zinc-800 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder:text-zinc-500 mb-3"
      />
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {chips.map(c => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className={`shrink-0 text-xs px-3 py-1 rounded-full font-medium ${
              filter === c.value ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      {filtered.map(ex => (
        <button
          key={ex.id}
          onClick={() => handleSelect(ex)}
          className="w-full flex justify-between items-center bg-zinc-900 rounded-xl px-4 py-3 mb-2 active:bg-zinc-800"
        >
          <div className="text-left">
            <p className="text-white text-sm font-medium">{ex.name}</p>
            <p className="text-zinc-500 text-xs capitalize">{ex.type} · {ex.muscleGroup}</p>
          </div>
          <span className="text-zinc-600 text-lg">›</span>
        </button>
      ))}
      {showNew && (
        <NewExerciseSheet
          onSaved={() => { setShowNew(false); load() }}
          onClose={() => setShowNew(false)}
        />
      )}
    </div>
  )
}
