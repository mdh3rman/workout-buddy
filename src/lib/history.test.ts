import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { db, saveSession } from '../db/index'
import { getPreviousPerformance, formatPreviousPerformance } from './history'
import type { WorkoutSession } from '../types'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

describe('getPreviousPerformance', () => {
  it('returns null when no history', async () => {
    const result = await getPreviousPerformance('barbell-bench-press')
    expect(result).toBeNull()
  })

  it('returns the most recent completed exercise', async () => {
    const session: WorkoutSession = {
      id: 's1',
      planId: null,
      name: null,
      startedAt: '2026-05-01T10:00:00.000Z',
      endedAt: '2026-05-01T11:00:00.000Z',
      exercises: [{
        exerciseId: 'barbell-bench-press',
        targetSets: 3,
        targetReps: 5,
        weight: 60,
        sets: [
          { reps: 5, completedAt: '2026-05-01T10:05:00.000Z' },
          { reps: 5, completedAt: '2026-05-01T10:10:00.000Z' },
          { reps: 4, completedAt: '2026-05-01T10:15:00.000Z' },
        ],
      }],
    }
    await saveSession(session)
    const result = await getPreviousPerformance('barbell-bench-press')
    expect(result?.weight).toBe(60)
    expect(result?.sets).toHaveLength(3)
  })
})

describe('formatPreviousPerformance', () => {
  it('formats sets as weight×reps', () => {
    const exercise = {
      exerciseId: 'barbell-bench-press',
      targetSets: 3,
      targetReps: 5,
      weight: 60,
      sets: [
        { reps: 5, completedAt: '2026-05-01T10:05:00.000Z' },
        { reps: 5, completedAt: '2026-05-01T10:10:00.000Z' },
        { reps: 4, completedAt: '2026-05-01T10:15:00.000Z' },
      ],
    }
    expect(formatPreviousPerformance(exercise, 'barbell')).toBe('Last time: 60kg ×5 · 60kg ×5 · 60kg ×4')
  })

  it('formats bodyweight sets without kg', () => {
    const exercise = {
      exerciseId: 'bw-pull-up',
      targetSets: 3,
      targetReps: 8,
      weight: 0,
      sets: [
        { reps: 8, completedAt: '2026-05-01T10:05:00.000Z' },
        { reps: 7, completedAt: '2026-05-01T10:10:00.000Z' },
      ],
    }
    expect(formatPreviousPerformance(exercise, 'bodyweight')).toBe('Last time: BW ×8 · BW ×7')
  })
})
