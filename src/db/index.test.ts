// src/db/index.test.ts
import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { db, saveSession, getActiveSession, getCompletedSessions, savePlan, getPlans } from './index'
import type { WorkoutSession, WorkoutPlan } from '../types'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

const makeSession = (overrides: Partial<WorkoutSession> = {}): WorkoutSession => ({
  id: 'sess-1',
  planId: null,
  name: null,
  startedAt: new Date().toISOString(),
  endedAt: null,
  exercises: [],
  ...overrides,
})

describe('getActiveSession', () => {
  it('returns null when no session exists', async () => {
    const result = await getActiveSession()
    expect(result).toBeUndefined()
  })

  it('returns session with endedAt null', async () => {
    await saveSession(makeSession({ id: 'active' }))
    const result = await getActiveSession()
    expect(result?.id).toBe('active')
  })

  it('does not return completed sessions', async () => {
    await saveSession(makeSession({ id: 'done', endedAt: new Date().toISOString() }))
    const result = await getActiveSession()
    expect(result).toBeUndefined()
  })
})

describe('getCompletedSessions', () => {
  it('returns only completed sessions, newest first', async () => {
    await saveSession(makeSession({ id: 'active', endedAt: null }))
    await saveSession(makeSession({ id: 'old', startedAt: '2026-01-01T10:00:00.000Z', endedAt: '2026-01-01T11:00:00.000Z' }))
    await saveSession(makeSession({ id: 'new', startedAt: '2026-06-01T10:00:00.000Z', endedAt: '2026-06-01T11:00:00.000Z' }))
    const result = await getCompletedSessions()
    expect(result.map(s => s.id)).toEqual(['new', 'old'])
  })
})

describe('plans', () => {
  it('saves and retrieves plans ordered by lastUsedAt', async () => {
    const plan: WorkoutPlan = { id: 'p1', name: 'Push', createdAt: new Date().toISOString(), lastUsedAt: null, exercises: [] }
    await savePlan(plan)
    const plans = await getPlans()
    expect(plans[0].id).toBe('p1')
  })
})
