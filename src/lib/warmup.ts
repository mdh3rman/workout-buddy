import { db } from '../db/index'
import type { ExerciseType, PlanExercise, SessionExercise, SessionSet } from '../types'

// Warmup skipped entirely if working weight is below this threshold.
// For barbell: the empty bar (20kg) never needs warming up since you can't go lighter.
// For others: no warmup below 20kg as the loads are light enough to self-warm.
const WARMUP_THRESHOLD: Record<ExerciseType, number> = {
  barbell: 20,
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

// Minimum weight a warmup set can be for each equipment type.
// For barbell this is the empty bar (20kg) — there is no lighter standard barbell.
const MIN_WEIGHT: Record<ExerciseType, number> = {
  barbell: 20,
  dumbbell: 1.25,
  cable: 2.5,
  machine: 2.5,
  bodyweight: 0,
}

// Fixed 3-step warm-up structure:
// 1. 50%   × 10 reps  — Pattern (groove the movement)
// 2. 70%   ×  5 reps  — Load    (feel the weight)
// 3. 87.5% ×  2 reps  — Prime   (prime the nervous system)
const WARMUP_SPECS = [
  { pct: 0.5,   reps: 10 },
  { pct: 0.7,   reps: 5  },
  { pct: 0.875, reps: 2  },
] as const

function roundToStep(weight: number, type: ExerciseType): number {
  const step = STEP[type]
  if (step === 0) return 0
  return Math.max(MIN_WEIGHT[type], Math.round(weight / step) * step)
}

export function generateWarmupSets(weight: number, type: ExerciseType): SessionSet[] {
  if (weight < WARMUP_THRESHOLD[type]) return []

  const sets: SessionSet[] = []
  let lastWeight = -1

  for (const { pct, reps } of WARMUP_SPECS) {
    const warmupWeight = roundToStep(weight * pct, type)
    // Skip if this rounds to the same weight as the previous set (dedup)
    // or if it reaches the working weight itself.
    if (warmupWeight >= weight || warmupWeight === lastWeight) continue
    sets.push({ reps, completedAt: null, weight: warmupWeight, isWarmup: true, warmupTargetReps: reps })
    lastWeight = warmupWeight
  }

  return sets
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
