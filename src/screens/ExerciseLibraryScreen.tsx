// src/screens/ExerciseLibraryScreen.tsx
import { useState, useEffect } from 'react'
import { db, getCompletedSessions } from '../db/index'
import type { Exercise, ExerciseType, WorkoutSession } from '../types'

type FilterType = ExerciseType | 'all'

export function ExerciseLibraryScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [selected, setSelected] = useState<Exercise | null>(null)
  const [history, setHistory] = useState<WorkoutSession[]>([])

  useEffect(() => { db.exercises.toArray().then(setExercises) }, [])

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
      <h1 className="text-white font-extrabold text-xl mb-4 pt-2">Exercises</h1>
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
    </div>
  )
}
