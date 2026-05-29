// src/screens/ActiveWorkoutScreen.tsx
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useWorkoutStore } from '../store/workoutStore'
import { SetCircle } from '../components/SetCircle'
import { RestTimerBar } from '../components/RestTimerBar'
import { ExercisePicker } from '../components/ExercisePicker'
import { SetConfigSheet } from '../components/SetConfigSheet'
import { EndWorkoutModal } from '../components/EndWorkoutModal'
import { getPreviousPerformance, formatPreviousPerformance } from '../lib/history'
import { adjustWeight } from '../lib/weight'
import { db } from '../db/index'
import type { Exercise, SessionExercise } from '../types'

function formatDuration(startedAt: string): string {
  const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0')
  const s = (elapsed % 60).toString().padStart(2, '0')
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`
}

function calcVolume(exercises: SessionExercise[]): number {
  return exercises.reduce((total, ex) => {
    const completedReps = ex.sets
      .filter(s => s.completedAt !== null)
      .reduce((sum, s) => sum + s.reps, 0)
    return total + completedReps * ex.weight
  }, 0)
}

export function ActiveWorkoutScreen() {
  const activeSession = useWorkoutStore(s => s.activeSession)
  const tapSet = useWorkoutStore(s => s.tapSet)
  const addExercise = useWorkoutStore(s => s.addExercise)
  const updateWeight = useWorkoutStore(s => s.updateWeight)
  const cancelSession = useWorkoutStore(s => s.cancelSession)

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [showEndModal, setShowEndModal] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [prevPerf, setPrevPerf] = useState<Record<string, string>>({})
  const [exerciseMap, setExerciseMap] = useState<Record<string, Exercise>>({})
  const [duration, setDuration] = useState('')

  useEffect(() => {
    if (!activeSession) return
    const tick = () => setDuration(formatDuration(activeSession.startedAt))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [activeSession?.startedAt])

  useEffect(() => {
    db.exercises.toArray().then(exs => {
      setExerciseMap(Object.fromEntries(exs.map(e => [e.id, e])))
    })
  }, [])

  const exerciseIds = (activeSession?.exercises ?? []).map(e => e.exerciseId).join(',')

  useEffect(() => {
    if (!exerciseIds || Object.keys(exerciseMap).length === 0) return
    const idList = exerciseIds.split(',')
    const load = async () => {
      const entries: Record<string, string> = {}
      for (const exerciseId of idList) {
        const perf = await getPreviousPerformance(exerciseId)
        const exInfo = exerciseMap[exerciseId]
        if (perf && exInfo) {
          entries[exerciseId] = formatPreviousPerformance(perf, exInfo.type)
        }
      }
      setPrevPerf(entries)
    }
    load()
  }, [exerciseIds, exerciseMap])

  if (!activeSession) return null

  const volume = calcVolume(activeSession.exercises)

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="bg-zinc-900 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <div>
          <p className="text-orange-500 text-2xl font-extrabold tracking-widest">{duration}</p>
          <p className="text-zinc-500 text-[9px] uppercase tracking-wider">Duration</p>
        </div>
        <div className="text-right">
          <p className="text-white text-lg font-bold">{Math.round(volume)} kg</p>
          <p className="text-zinc-500 text-[9px] uppercase tracking-wider">Volume</p>
        </div>
      </div>

      {/* Exercise list */}
      <div className="pb-40">
        {activeSession.exercises.map((ex, ei) => {
          const info = exerciseMap[ex.exerciseId]
          const isExpanded = expandedIdx === ei
          const doneSets = ex.sets.filter(s => s.completedAt !== null).length

          return (
            <div key={`${ex.exerciseId}-${ei}`} className="border-b border-zinc-800">
              {/* Collapsed header */}
              <button
                className="w-full flex justify-between items-center px-4 py-3"
                onClick={() => setExpandedIdx(isExpanded ? null : ei)}
              >
                <div className="text-left">
                  <p className="text-white font-bold">{info?.name ?? ex.exerciseId}</p>
                  {!isExpanded && (
                    <p className="text-zinc-500 text-xs">
                      {ex.targetSets} sets · {ex.weight > 0 ? `${ex.weight}kg` : 'BW'} · {doneSets}/{ex.targetSets} done
                    </p>
                  )}
                </div>
                <span className="text-zinc-500 text-lg">{isExpanded ? '∧' : '›'}</span>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4">
                  {prevPerf[ex.exerciseId] && (
                    <p className="text-zinc-600 text-xs mb-3">{prevPerf[ex.exerciseId]}</p>
                  )}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-zinc-400 text-sm font-medium">Work sets</span>
                    {info?.type !== 'bodyweight' && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateWeight(ei, adjustWeight(ex.weight, info?.type ?? 'barbell', -1))}
                          className="text-zinc-500 text-xl w-8 text-center"
                        >−</button>
                        <span className="text-white font-bold text-sm min-w-[60px] text-center">{ex.weight} kg</span>
                        <button
                          onClick={() => updateWeight(ei, adjustWeight(ex.weight, info?.type ?? 'barbell', 1))}
                          className="text-zinc-500 text-xl w-8 text-center"
                        >+</button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {ex.sets.map((set, si) => (
                      <div key={si} className="flex flex-col items-center gap-1">
                        <SetCircle
                          reps={set.reps}
                          targetReps={ex.targetReps}
                          completedAt={set.completedAt}
                          onTap={() => tapSet(ei, si)}
                        />
                        <span className="text-zinc-600 text-[9px]">
                          {set.completedAt
                            ? (info?.type === 'bodyweight' ? 'BW' : `${set.weight ?? ex.weight}kg`)
                            : 'pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Add exercise */}
        <div className="px-4 py-3">
          <button
            onClick={() => setShowPicker(true)}
            className="w-full border-2 border-dashed border-zinc-700 rounded-xl py-3 text-orange-500 font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Exercise
          </button>
        </div>

        {/* End / Cancel workout */}
        <div className="px-4 pb-4 flex gap-3">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="flex-1 bg-zinc-800 rounded-xl py-3 text-zinc-500 font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowEndModal(true)}
            className="flex-1 bg-zinc-800 rounded-xl py-3 text-orange-400 font-semibold text-sm"
          >
            End Workout
          </button>
        </div>
      </div>

      <RestTimerBar />

      {showPicker && (
        <ExercisePicker
          onSelect={ex => { setSelectedExercise(ex); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {selectedExercise && (
        <SetConfigSheet
          exercise={selectedExercise}
          onAdd={(sets, reps, weight) => {
            addExercise(selectedExercise.id, sets, reps, weight)
            setSelectedExercise(null)
            setExpandedIdx(activeSession.exercises.length)
          }}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {showEndModal && (
        <EndWorkoutModal
          session={activeSession}
          onClose={() => setShowEndModal(false)}
        />
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="flex-1 bg-black/80" onClick={() => setShowCancelConfirm(false)} />
          <div className="bg-zinc-900 rounded-t-2xl p-6">
            <p className="text-white font-bold text-base mb-1 text-center">Cancel workout?</p>
            <p className="text-zinc-500 text-sm text-center mb-6">This session won't be saved.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-zinc-800 text-white font-semibold py-3 rounded-xl text-sm"
              >
                Keep going
              </button>
              <button
                onClick={() => cancelSession()}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl text-sm"
              >
                Cancel workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
