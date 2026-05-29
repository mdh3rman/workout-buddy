import { create } from 'zustand'
import { saveSession, getActiveSession, deleteSession } from '../db/index'
import { generateWarmupSets } from '../lib/warmup'
import type { WorkoutSession, SessionExercise, SessionSet, RestTimerState, Screen, ExerciseType } from '../types'

interface WorkoutStore {
  activeSession: WorkoutSession | null
  restTimer: RestTimerState
  currentScreen: Screen

  startSession: (planId?: string, name?: string, exercises?: SessionExercise[]) => void
  addExercise: (exerciseId: string, exerciseType: ExerciseType, sets: number, reps: number, weight: number) => void
  tapSet: (exerciseIdx: number, setIdx: number) => void
  updateWeight: (exerciseIdx: number, newWeight: number) => void
  endSession: () => Promise<WorkoutSession>
  cancelSession: () => Promise<void>

  startRest: (seconds?: number) => void
  tickRest: () => void
  skipRest: () => void
  addRestTime: (seconds: number) => void

  setScreen: (screen: Screen) => void
  loadActiveSession: () => Promise<void>
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  activeSession: null,
  restTimer: { isActive: false, secondsRemaining: 0, totalSeconds: 120 },
  currentScreen: 'home',

  startSession: (planId, name, exercises = []) => {
    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      planId: planId ?? null,
      name: name ?? null,
      startedAt: new Date().toISOString(),
      endedAt: null,
      exercises,
    }
    set({ activeSession: session, currentScreen: 'active-workout' })
    saveSession(session).catch(err => console.error('Failed to persist session:', err))
  },

  addExercise: (exerciseId, exerciseType, sets, reps, weight) => {
    const { activeSession } = get()
    if (!activeSession) return
    const warmup = generateWarmupSets(weight, exerciseType)
    const working: SessionSet[] = Array.from({ length: sets }, () => ({ reps, completedAt: null }))
    const exercise: SessionExercise = {
      exerciseId,
      targetSets: sets,
      targetReps: reps,
      weight,
      sets: [...warmup, ...working],
    }
    const updated: WorkoutSession = {
      ...activeSession,
      exercises: [...activeSession.exercises, exercise],
    }
    set({ activeSession: updated })
    saveSession(updated).catch(err => console.error('Failed to persist session:', err))
  },

  tapSet: (exerciseIdx, setIdx) => {
    const { activeSession } = get()
    if (!activeSession) return
    const wasCompleting = activeSession.exercises[exerciseIdx].sets[setIdx].completedAt === null
    const exercises = activeSession.exercises.map((ex, ei) => {
      if (ei !== exerciseIdx) return ex
      const sets = ex.sets.map((s, si) => {
        if (si !== setIdx) return s
        if (s.completedAt === null) {
          const completedReps = s.isWarmup ? s.reps : ex.targetReps
          return { ...s, reps: completedReps, completedAt: new Date().toISOString(), weight: s.weight ?? ex.weight }
        }
        if (s.reps === 0) {
          return { ...s, reps: s.warmupTargetReps ?? ex.targetReps, completedAt: null, weight: undefined }
        }
        return { ...s, reps: s.reps - 1 }
      })
      return { ...ex, sets }
    })
    const updated: WorkoutSession = { ...activeSession, exercises }
    set({ activeSession: updated })
    saveSession(updated).catch(err => console.error('Failed to persist session:', err))
    if (wasCompleting) get().startRest()
  },

  updateWeight: (exerciseIdx, newWeight) => {
    const { activeSession } = get()
    if (!activeSession) return
    const exercises = activeSession.exercises.map((ex, ei) => {
      if (ei !== exerciseIdx) return ex
      return { ...ex, weight: newWeight }
    })
    const updated: WorkoutSession = { ...activeSession, exercises }
    set({ activeSession: updated })
    saveSession(updated).catch(err => console.error('Failed to persist session:', err))
  },

  endSession: async () => {
    const { activeSession } = get()
    if (!activeSession) throw new Error('No active session')
    const completed: WorkoutSession = { ...activeSession, endedAt: new Date().toISOString() }
    await saveSession(completed)
    set({ activeSession: null, currentScreen: 'home' })
    return completed
  },

  cancelSession: async () => {
    const { activeSession } = get()
    if (!activeSession) return
    await deleteSession(activeSession.id)
    set({ activeSession: null, currentScreen: 'home', restTimer: { isActive: false, secondsRemaining: 0, totalSeconds: 120 } })
  },

  startRest: (seconds = 120) => {
    set({ restTimer: { isActive: true, secondsRemaining: seconds, totalSeconds: seconds } })
  },

  tickRest: () => {
    const { restTimer } = get()
    if (!restTimer.isActive) return
    const next = restTimer.secondsRemaining - 1
    if (next <= 0) {
      set({ restTimer: { ...restTimer, isActive: false, secondsRemaining: 0 } })
    } else {
      set({ restTimer: { ...restTimer, secondsRemaining: next } })
    }
  },

  skipRest: () => {
    set({ restTimer: { isActive: false, secondsRemaining: 0, totalSeconds: 120 } })
  },

  addRestTime: (seconds) => {
    const { restTimer } = get()
    set({ restTimer: { ...restTimer, secondsRemaining: restTimer.secondsRemaining + seconds } })
  },

  setScreen: (screen) => set({ currentScreen: screen }),

  loadActiveSession: async () => {
    const session = await getActiveSession()
    if (session) {
      set({ activeSession: session, currentScreen: 'home' })
    }
  },
}))
