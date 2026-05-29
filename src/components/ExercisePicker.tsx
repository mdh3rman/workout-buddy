// src/components/ExercisePicker.tsx
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { db } from '../db/index'
import type { Exercise, ExerciseType } from '../types'

type FilterType = ExerciseType | 'all'

interface ExercisePickerProps {
  onSelect: (exercise: Exercise) => void
  onClose: () => void
}

export function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    db.exercises.toArray().then(setExercises)
  }, [])

  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || ex.type === filter
    return matchesSearch && matchesFilter
  })

  const chips: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Barbell', value: 'barbell' },
    { label: 'Dumbbell', value: 'dumbbell' },
    { label: 'Cable', value: 'cable' },
    { label: 'Machine', value: 'machine' },
    { label: 'Body', value: 'bodyweight' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div className="bg-zinc-900 rounded-t-2xl flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-base">Add Exercise</h2>
            <button onClick={onClose}><X size={20} className="text-zinc-400" /></button>
          </div>
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-800 text-white text-sm rounded-lg px-3 py-2.5 outline-none placeholder:text-zinc-500"
            autoFocus
          />
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
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
        </div>
        <div className="overflow-y-auto flex-1">
          {filtered.map(ex => (
            <button
              key={ex.id}
              onClick={() => onSelect(ex)}
              className="w-full flex justify-between items-center px-4 py-3 border-b border-zinc-800/50 active:bg-zinc-800"
            >
              <div className="text-left">
                <p className="text-white text-sm font-medium">{ex.name}</p>
                <p className="text-zinc-500 text-xs capitalize">{ex.type} · {ex.muscleGroup}</p>
              </div>
              <span className="text-orange-500 text-xs font-semibold">+ Add</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
