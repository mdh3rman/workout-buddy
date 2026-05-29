import type { ExerciseType } from '../types'

const STEP: Record<ExerciseType, number> = {
  barbell: 2.5,
  dumbbell: 1.25,
  cable: 2.5,
  machine: 2.5,
  bodyweight: 0,
}

const MIN: Record<ExerciseType, number> = {
  barbell: 20,
  dumbbell: 1.25,
  cable: 2.5,
  machine: 2.5,
  bodyweight: 0,
}

const DEFAULT: Record<ExerciseType, number> = {
  barbell: 20,
  dumbbell: 10,
  cable: 20,
  machine: 20,
  bodyweight: 0,
}

export function stepSize(type: ExerciseType): number {
  return STEP[type]
}

export function adjustWeight(current: number, type: ExerciseType, delta: 1 | -1): number {
  if (type === 'bodyweight') return 0
  return Math.max(MIN[type], current + delta * STEP[type])
}

export function defaultWeight(type: ExerciseType): number {
  return DEFAULT[type]
}

export function formatWeight(weight: number, type: ExerciseType): string {
  if (type === 'bodyweight') return 'BW'
  const rounded = Math.round(weight * 100) / 100
  return `${rounded} kg`
}
