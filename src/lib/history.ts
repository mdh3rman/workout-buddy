import { db } from '../db/index'
import type { SessionExercise, ExerciseType } from '../types'

export async function getPreviousPerformance(exerciseId: string): Promise<SessionExercise | null> {
  const all = await db.workoutSessions.toArray()
  const completed = all
    .filter(s => s.endedAt !== null && s.exercises.some(e => e.exerciseId === exerciseId))
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
  if (completed.length === 0) return null
  return completed[0].exercises.find(e => e.exerciseId === exerciseId) ?? null
}

export function formatPreviousPerformance(exercise: SessionExercise, type: ExerciseType): string {
  const completedSets = exercise.sets.filter(s => s.completedAt !== null)
  const parts = completedSets.map(s => {
    const w = s.weight ?? exercise.weight
    const weightStr = type === 'bodyweight' ? 'BW' : `${w}kg`
    return `${weightStr} ×${s.reps}`
  })
  return `Last time: ${parts.join(' · ')}`
}
