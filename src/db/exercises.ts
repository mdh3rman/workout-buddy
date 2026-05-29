// src/db/exercises.ts
import type { Exercise } from '../types'

export const EXERCISES: Exercise[] = [
  // BARBELL — chest
  { id: 'barbell-bench-press', name: 'Bench Press', type: 'barbell', muscleGroup: 'chest' },
  { id: 'barbell-incline-bench-press', name: 'Incline Bench Press', type: 'barbell', muscleGroup: 'chest' },
  { id: 'barbell-decline-bench-press', name: 'Decline Bench Press', type: 'barbell', muscleGroup: 'chest' },
  { id: 'barbell-close-grip-bench-press', name: 'Close Grip Bench Press', type: 'barbell', muscleGroup: 'chest' },
  // BARBELL — back
  { id: 'barbell-deadlift', name: 'Deadlift', type: 'barbell', muscleGroup: 'back' },
  { id: 'barbell-row', name: 'Barbell Row', type: 'barbell', muscleGroup: 'back' },
  { id: 'barbell-romanian-deadlift', name: 'Romanian Deadlift', type: 'barbell', muscleGroup: 'back' },
  { id: 'barbell-good-morning', name: 'Good Morning', type: 'barbell', muscleGroup: 'back' },
  // BARBELL — legs
  { id: 'barbell-squat', name: 'Barbell Squat', type: 'barbell', muscleGroup: 'legs' },
  { id: 'barbell-front-squat', name: 'Front Squat', type: 'barbell', muscleGroup: 'legs' },
  { id: 'barbell-hip-thrust', name: 'Barbell Hip Thrust', type: 'barbell', muscleGroup: 'legs' },
  { id: 'barbell-lunge', name: 'Barbell Lunge', type: 'barbell', muscleGroup: 'legs' },
  { id: 'barbell-calf-raise', name: 'Barbell Calf Raise', type: 'barbell', muscleGroup: 'legs' },
  // BARBELL — shoulders
  { id: 'barbell-overhead-press', name: 'Overhead Press', type: 'barbell', muscleGroup: 'shoulders' },
  { id: 'barbell-upright-row', name: 'Barbell Upright Row', type: 'barbell', muscleGroup: 'shoulders' },
  { id: 'barbell-shrug', name: 'Barbell Shrug', type: 'barbell', muscleGroup: 'shoulders' },
  // BARBELL — arms
  { id: 'barbell-curl', name: 'Barbell Curl', type: 'barbell', muscleGroup: 'arms' },
  { id: 'barbell-skull-crushers', name: 'Skull Crushers', type: 'barbell', muscleGroup: 'arms' },

  // DUMBBELL — chest
  { id: 'db-bench-press', name: 'DB Bench Press', type: 'dumbbell', muscleGroup: 'chest' },
  { id: 'db-incline-press', name: 'Incline DB Press', type: 'dumbbell', muscleGroup: 'chest' },
  { id: 'db-decline-press', name: 'Decline DB Press', type: 'dumbbell', muscleGroup: 'chest' },
  { id: 'db-fly', name: 'DB Fly', type: 'dumbbell', muscleGroup: 'chest' },
  { id: 'db-incline-fly', name: 'Incline DB Fly', type: 'dumbbell', muscleGroup: 'chest' },
  // DUMBBELL — back
  { id: 'db-row', name: 'DB Row', type: 'dumbbell', muscleGroup: 'back' },
  { id: 'db-romanian-deadlift', name: 'DB Romanian Deadlift', type: 'dumbbell', muscleGroup: 'back' },
  { id: 'db-reverse-fly', name: 'DB Reverse Fly', type: 'dumbbell', muscleGroup: 'back' },
  { id: 'db-shrug', name: 'DB Shrug', type: 'dumbbell', muscleGroup: 'shoulders' },
  // DUMBBELL — legs
  { id: 'db-lunge', name: 'DB Lunge', type: 'dumbbell', muscleGroup: 'legs' },
  { id: 'db-squat', name: 'DB Squat', type: 'dumbbell', muscleGroup: 'legs' },
  { id: 'db-hip-thrust', name: 'DB Hip Thrust', type: 'dumbbell', muscleGroup: 'legs' },
  { id: 'db-step-up', name: 'DB Step Up', type: 'dumbbell', muscleGroup: 'legs' },
  { id: 'db-calf-raise', name: 'DB Calf Raise', type: 'dumbbell', muscleGroup: 'legs' },
  // DUMBBELL — shoulders
  { id: 'db-shoulder-press', name: 'DB Shoulder Press', type: 'dumbbell', muscleGroup: 'shoulders' },
  { id: 'db-lateral-raise', name: 'DB Lateral Raise', type: 'dumbbell', muscleGroup: 'shoulders' },
  { id: 'db-front-raise', name: 'DB Front Raise', type: 'dumbbell', muscleGroup: 'shoulders' },
  { id: 'db-arnold-press', name: 'Arnold Press', type: 'dumbbell', muscleGroup: 'shoulders' },
  // DUMBBELL — arms
  { id: 'db-curl', name: 'DB Curl', type: 'dumbbell', muscleGroup: 'arms' },
  { id: 'db-hammer-curl', name: 'Hammer Curl', type: 'dumbbell', muscleGroup: 'arms' },
  { id: 'db-concentration-curl', name: 'Concentration Curl', type: 'dumbbell', muscleGroup: 'arms' },
  { id: 'db-tricep-kickback', name: 'DB Tricep Kickback', type: 'dumbbell', muscleGroup: 'arms' },
  { id: 'db-overhead-tricep-ext', name: 'DB Overhead Tricep Extension', type: 'dumbbell', muscleGroup: 'arms' },

  // CABLE — chest
  { id: 'cable-fly', name: 'Cable Fly', type: 'cable', muscleGroup: 'chest' },
  { id: 'cable-low-fly', name: 'Low Cable Fly', type: 'cable', muscleGroup: 'chest' },
  { id: 'cable-high-fly', name: 'High Cable Fly', type: 'cable', muscleGroup: 'chest' },
  // CABLE — back
  { id: 'cable-row', name: 'Cable Row', type: 'cable', muscleGroup: 'back' },
  { id: 'cable-single-arm-row', name: 'Single Arm Cable Row', type: 'cable', muscleGroup: 'back' },
  { id: 'cable-lat-pulldown', name: 'Lat Pulldown', type: 'cable', muscleGroup: 'back' },
  { id: 'cable-pull-through', name: 'Cable Pull-Through', type: 'cable', muscleGroup: 'legs' },
  { id: 'cable-kickback', name: 'Cable Kickback', type: 'cable', muscleGroup: 'legs' },
  // CABLE — shoulders
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', type: 'cable', muscleGroup: 'shoulders' },
  { id: 'cable-upright-row', name: 'Cable Upright Row', type: 'cable', muscleGroup: 'shoulders' },
  { id: 'cable-face-pull', name: 'Face Pull', type: 'cable', muscleGroup: 'shoulders' },
  { id: 'cable-shrug', name: 'Cable Shrug', type: 'cable', muscleGroup: 'shoulders' },
  // CABLE — arms
  { id: 'cable-tricep-pushdown', name: 'Cable Tricep Pushdown', type: 'cable', muscleGroup: 'arms' },
  { id: 'cable-rope-pushdown', name: 'Rope Tricep Pushdown', type: 'cable', muscleGroup: 'arms' },
  { id: 'cable-curl', name: 'Cable Curl', type: 'cable', muscleGroup: 'arms' },
  { id: 'cable-rope-curl', name: 'Rope Curl', type: 'cable', muscleGroup: 'arms' },
  // CABLE — core
  { id: 'cable-crunch', name: 'Cable Crunch', type: 'cable', muscleGroup: 'core' },

  // MACHINE — legs
  { id: 'machine-leg-press', name: 'Leg Press', type: 'machine', muscleGroup: 'legs' },
  { id: 'machine-leg-curl', name: 'Leg Curl', type: 'machine', muscleGroup: 'legs' },
  { id: 'machine-leg-extension', name: 'Leg Extension', type: 'machine', muscleGroup: 'legs' },
  { id: 'machine-hack-squat', name: 'Hack Squat', type: 'machine', muscleGroup: 'legs' },
  { id: 'machine-calf-press', name: 'Calf Press Machine', type: 'machine', muscleGroup: 'legs' },
  { id: 'machine-abductor', name: 'Abductor Machine', type: 'machine', muscleGroup: 'legs' },
  { id: 'machine-adductor', name: 'Adductor Machine', type: 'machine', muscleGroup: 'legs' },
  { id: 'machine-smith-squat', name: 'Smith Machine Squat', type: 'machine', muscleGroup: 'legs' },
  // MACHINE — chest
  { id: 'machine-chest-press', name: 'Chest Press Machine', type: 'machine', muscleGroup: 'chest' },
  { id: 'machine-pec-deck', name: 'Pec Deck', type: 'machine', muscleGroup: 'chest' },
  { id: 'machine-smith-bench', name: 'Smith Machine Bench Press', type: 'machine', muscleGroup: 'chest' },
  // MACHINE — back
  { id: 'machine-seated-row', name: 'Seated Row Machine', type: 'machine', muscleGroup: 'back' },
  { id: 'machine-lat-pulldown', name: 'Machine Lat Pulldown', type: 'machine', muscleGroup: 'back' },
  { id: 'machine-assisted-pullup', name: 'Assisted Pull Up', type: 'machine', muscleGroup: 'back' },
  { id: 'machine-smith-row', name: 'Smith Machine Row', type: 'machine', muscleGroup: 'back' },
  // MACHINE — shoulders
  { id: 'machine-shoulder-press', name: 'Shoulder Press Machine', type: 'machine', muscleGroup: 'shoulders' },
  { id: 'machine-rear-delt-fly', name: 'Rear Delt Fly Machine', type: 'machine', muscleGroup: 'shoulders' },
  // MACHINE — arms
  { id: 'machine-dip', name: 'Dip Machine', type: 'machine', muscleGroup: 'arms' },

  // BODYWEIGHT — back
  { id: 'bw-pull-up', name: 'Pull Up', type: 'bodyweight', muscleGroup: 'back' },
  { id: 'bw-chin-up', name: 'Chin Up', type: 'bodyweight', muscleGroup: 'back' },
  { id: 'bw-inverted-row', name: 'Inverted Row', type: 'bodyweight', muscleGroup: 'back' },
  { id: 'bw-australian-pull-up', name: 'Australian Pull Up', type: 'bodyweight', muscleGroup: 'back' },
  // BODYWEIGHT — chest/arms
  { id: 'bw-dip', name: 'Dip', type: 'bodyweight', muscleGroup: 'chest' },
  { id: 'bw-push-up', name: 'Push Up', type: 'bodyweight', muscleGroup: 'chest' },
  { id: 'bw-wide-push-up', name: 'Wide Push Up', type: 'bodyweight', muscleGroup: 'chest' },
  { id: 'bw-diamond-push-up', name: 'Diamond Push Up', type: 'bodyweight', muscleGroup: 'arms' },
  { id: 'bw-pike-push-up', name: 'Pike Push Up', type: 'bodyweight', muscleGroup: 'shoulders' },
  // BODYWEIGHT — legs
  { id: 'bw-squat', name: 'Bodyweight Squat', type: 'bodyweight', muscleGroup: 'legs' },
  { id: 'bw-lunge', name: 'Lunge', type: 'bodyweight', muscleGroup: 'legs' },
  { id: 'bw-reverse-lunge', name: 'Reverse Lunge', type: 'bodyweight', muscleGroup: 'legs' },
  { id: 'bw-glute-bridge', name: 'Glute Bridge', type: 'bodyweight', muscleGroup: 'legs' },
  { id: 'bw-box-jump', name: 'Box Jump', type: 'bodyweight', muscleGroup: 'legs' },
  { id: 'bw-jump-squat', name: 'Jump Squat', type: 'bodyweight', muscleGroup: 'legs' },
  { id: 'bw-step-up', name: 'Step Up', type: 'bodyweight', muscleGroup: 'legs' },
  { id: 'bw-calf-raise', name: 'Calf Raise', type: 'bodyweight', muscleGroup: 'legs' },
  // BODYWEIGHT — core
  { id: 'bw-plank', name: 'Plank', type: 'bodyweight', muscleGroup: 'core' },
  { id: 'bw-side-plank', name: 'Side Plank', type: 'bodyweight', muscleGroup: 'core' },
  { id: 'bw-sit-up', name: 'Sit Up', type: 'bodyweight', muscleGroup: 'core' },
  { id: 'bw-crunch', name: 'Crunch', type: 'bodyweight', muscleGroup: 'core' },
  { id: 'bw-bicycle-crunch', name: 'Bicycle Crunch', type: 'bodyweight', muscleGroup: 'core' },
  { id: 'bw-leg-raise', name: 'Leg Raise', type: 'bodyweight', muscleGroup: 'core' },
  { id: 'bw-mountain-climber', name: 'Mountain Climber', type: 'bodyweight', muscleGroup: 'core' },
  // BODYWEIGHT — full body
  { id: 'bw-burpee', name: 'Burpee', type: 'bodyweight', muscleGroup: 'full body' },
]
