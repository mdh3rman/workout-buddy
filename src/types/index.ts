export type ExerciseType = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight'
export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'full body'
export type Screen = 'home' | 'active-workout' | 'plans' | 'history' | 'exercises'

export interface Exercise {
  id: string
  name: string
  type: ExerciseType
  muscleGroup: MuscleGroup
}

export interface PlanExercise {
  exerciseId: string
  sets: number
  reps: number
  weight: number
}

export interface WorkoutPlan {
  id: string
  name: string
  createdAt: string
  lastUsedAt: string | null
  exercises: PlanExercise[]
}

export interface SessionSet {
  reps: number
  completedAt: string | null
  weight?: number
  isWarmup?: boolean
  warmupTargetReps?: number  // original target reps for warmup reset
}

export interface SessionExercise {
  exerciseId: string
  targetSets: number
  targetReps: number
  weight: number
  sets: SessionSet[]
}

export interface WorkoutSession {
  id: string
  planId: string | null
  name: string | null
  startedAt: string
  endedAt: string | null
  exercises: SessionExercise[]
}

export interface RestTimerState {
  isActive: boolean
  secondsRemaining: number
  totalSeconds: number
}
