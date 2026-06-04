import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { useWorkoutStore } from './workoutStore'

const INITIAL_STATE = {
  activeSession: null,
  restTimer: { isActive: false, secondsRemaining: 0, totalSeconds: 120, endTime: null },
  currentScreen: 'home' as const,
}

beforeEach(() => {
  useWorkoutStore.setState(INITIAL_STATE)
})

describe('startSession', () => {
  it('creates a session with startedAt and no exercises', () => {
    useWorkoutStore.getState().startSession()
    const { activeSession } = useWorkoutStore.getState()
    expect(activeSession).not.toBeNull()
    expect(activeSession?.exercises).toHaveLength(0)
    expect(activeSession?.endedAt).toBeNull()
  })

  it('navigates to active-workout screen', () => {
    useWorkoutStore.getState().startSession()
    expect(useWorkoutStore.getState().currentScreen).toBe('active-workout')
  })
})

describe('addExercise', () => {
  it('adds working sets and warmup sets for heavy barbell exercise', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('barbell-bench-press', 'barbell', 4, 5, 60)
    const { activeSession } = useWorkoutStore.getState()
    expect(activeSession?.exercises).toHaveLength(1)
    const ex = activeSession!.exercises[0]
    expect(ex.exerciseId).toBe('barbell-bench-press')
    expect(ex.targetSets).toBe(4)
    expect(ex.targetReps).toBe(5)
    expect(ex.weight).toBe(60)
    const workingSets = ex.sets.filter(s => !s.isWarmup)
    const warmupSets = ex.sets.filter(s => s.isWarmup)
    expect(workingSets).toHaveLength(4)
    expect(warmupSets).toHaveLength(3) // 50%, 70%, 87.5% for 60kg barbell
    expect(workingSets[0]).toEqual({ reps: 5, completedAt: null })
  })

  it('adds no warmup sets for bodyweight exercise', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('push-up', 'bodyweight', 3, 10, 0)
    const ex = useWorkoutStore.getState().activeSession!.exercises[0]
    expect(ex.sets.filter(s => s.isWarmup)).toHaveLength(0)
    expect(ex.sets).toHaveLength(3)
  })
})

describe('tapSet', () => {
  // Use bodyweight so no warmup sets are injected — tests focus on working-set tap behavior
  beforeEach(() => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('push-up', 'bodyweight', 4, 5, 0)
  })

  it('completes a pending set at target reps', () => {
    useWorkoutStore.getState().tapSet(0, 0)
    const set = useWorkoutStore.getState().activeSession!.exercises[0].sets[0]
    expect(set.completedAt).not.toBeNull()
    expect(set.reps).toBe(5)
  })

  it('starts rest timer when completing a pending set', () => {
    useWorkoutStore.getState().tapSet(0, 0)
    const { restTimer } = useWorkoutStore.getState()
    expect(restTimer.isActive).toBe(true)
    expect(restTimer.secondsRemaining).toBe(120)
  })

  it('reduces reps by 1 when tapping a completed set', () => {
    useWorkoutStore.getState().tapSet(0, 0) // complete
    useWorkoutStore.getState().tapSet(0, 0) // reduce
    const set = useWorkoutStore.getState().activeSession!.exercises[0].sets[0]
    expect(set.reps).toBe(4)
  })

  it('does not reduce reps below 0', () => {
    useWorkoutStore.getState().tapSet(0, 0)
    for (let i = 0; i < 10; i++) useWorkoutStore.getState().tapSet(0, 0)
    const set = useWorkoutStore.getState().activeSession!.exercises[0].sets[0]
    expect(set.reps).toBe(0)
  })
})

describe('skipRest', () => {
  it('deactivates rest timer', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('push-up', 'bodyweight', 1, 5, 0)
    useWorkoutStore.getState().tapSet(0, 0)
    useWorkoutStore.getState().skipRest()
    expect(useWorkoutStore.getState().restTimer.isActive).toBe(false)
  })
})

describe('tickRest', () => {
  it('decrements secondsRemaining based on wall clock', () => {
    useWorkoutStore.setState({ restTimer: { isActive: true, secondsRemaining: 30, totalSeconds: 120, endTime: Date.now() + 29000 } })
    useWorkoutStore.getState().tickRest()
    expect(useWorkoutStore.getState().restTimer.secondsRemaining).toBe(29)
  })

  it('deactivates timer when endTime has passed', () => {
    useWorkoutStore.setState({ restTimer: { isActive: true, secondsRemaining: 1, totalSeconds: 120, endTime: Date.now() - 100 } })
    useWorkoutStore.getState().tickRest()
    expect(useWorkoutStore.getState().restTimer.isActive).toBe(false)
    expect(useWorkoutStore.getState().restTimer.secondsRemaining).toBe(0)
  })
})
