// src/db/index.ts
import Dexie, { type Table } from 'dexie'
import type { Exercise, WorkoutPlan, WorkoutSession } from '../types'

class WorkoutBuddyDB extends Dexie {
  exercises!: Table<Exercise, string>
  workoutPlans!: Table<WorkoutPlan, string>
  workoutSessions!: Table<WorkoutSession, string>

  constructor() {
    super('WorkoutBuddyDB')
    this.version(1).stores({
      exercises: 'id, type, muscleGroup',
      workoutPlans: 'id',
      workoutSessions: 'id',
    })
  }
}

export const db = new WorkoutBuddyDB()

export async function saveSession(session: WorkoutSession): Promise<void> {
  await db.workoutSessions.put(session)
}

export async function getActiveSession(): Promise<WorkoutSession | undefined> {
  return db.workoutSessions.filter(s => s.endedAt === null).first()
}

export async function getCompletedSessions(): Promise<WorkoutSession[]> {
  const all = await db.workoutSessions.toArray()
  return all
    .filter(s => s.endedAt !== null)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}

export async function savePlan(plan: WorkoutPlan): Promise<void> {
  await db.workoutPlans.put(plan)
}

export async function deletePlan(id: string): Promise<void> {
  await db.workoutPlans.delete(id)
}

export async function getPlans(): Promise<WorkoutPlan[]> {
  const all = await db.workoutPlans.toArray()
  return all.sort((a, b) => {
    if (!a.lastUsedAt && !b.lastUsedAt) return 0
    if (!a.lastUsedAt) return 1
    if (!b.lastUsedAt) return -1
    return b.lastUsedAt.localeCompare(a.lastUsedAt)
  })
}

export async function updatePlanLastUsed(id: string): Promise<void> {
  await db.workoutPlans.update(id, { lastUsedAt: new Date().toISOString() })
}

export async function seedExercises(exercises: Exercise[]): Promise<void> {
  const count = await db.exercises.count()
  if (count === 0) {
    await db.exercises.bulkAdd(exercises)
  }
}
