import { db } from '../db/index'
import type { ExerciseType, PlanExercise, SessionExercise, SessionSet } from '../types'

const WARMUP_THRESHOLD: Record<ExerciseType, number> = {
  barbell: 40,
  dumbbell: 20,
  cable: 20,
  machine: 20,
  bodyweight: Infinity,
}

const STEP: Record<ExerciseType, number> = {
  barbell: 2.5,
  dumbbell: 1.25,
  cable: 2.5,
  machine: 2.5,
  bodyweight: 0,
}

const MIN_WEIGHT: Record<ExerciseType, number> = {
  barbell: 20,
  dumbbell: 1.25,
  cable: 2.5,
  machine: 2.5,
  bodyweight: 0,
}

function roundToStep(weight: number, type: ExerciseType): number {
  const step = STEP[type]
  if (step === 0) return 0
  return Math.max(MIN_WEIGHT[type], Math.round(weight / step) * step)
}

type WarmupSpec = { pct: number; reps: number }

function warmupSpecs(weight: number, threshold: number): WarmupSpec[] {
  if (weight >= threshold * 2.5) {
    return [
      { pct: 0.3, reps: 5 },
      { pct: 0.5, reps: 5 },
      { pct: 0.7, reps: 3 },
      { pct: 0.9, reps: 2 },
    ]
  }
  if (weight >= threshold * 1.5) {
    return [
      { pct: 0.4, reps: 5 },
      { pct: 0.6, reps: 5 },
      { pct: 0.8, reps: 3 },
    ]
  }
  return [
    { pct: 0.5, reps: 5 },
    { pct: 0.8, reps: 3 },
  ]
}

export function generateWarmupSets(weight: number, type: ExerciseType): SessionSet[] {
  const threshold = WARMUP_THRESHOLD[type]
  if (weight < threshold) return []

  return warmupSpecs(weight, threshold).map(({ pct, reps }) => ({
    reps,
    completedAt: null,
    weight: roundToStep(weight * pct, type),
    isWarmup: true,
    warmupTargetReps: reps,
  }))
}

export async function buildSessionExercises(planExercises: PlanExercise[]): Promise<SessionExercise[]> {
  const ids = planExercises.map(pe => pe.exerciseId)
  const exercises = await db.exercises.where('id').anyOf(ids).toArray()
  const typeMap = Object.fromEntries(exercises.map(e => [e.id, e.type]))

  return planExercises.map(pe => {
    const type = typeMap[pe.exerciseId] ?? 'barbell'
    const warmup = generateWarmupSets(pe.weight, type)
    const working: SessionSet[] = Array.from({ length: pe.sets }, () => ({
      reps: pe.reps,
      completedAt: null,
    }))
    return {
      exerciseId: pe.exerciseId,
      targetSets: pe.sets,
      targetReps: pe.reps,
      weight: pe.weight,
      sets: [...warmup, ...working],
    }
  })
}
