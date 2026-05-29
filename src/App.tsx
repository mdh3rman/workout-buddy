import { useEffect } from 'react'
import { useWorkoutStore } from './store/workoutStore'
import { useRestTimer } from './hooks/useRestTimer'
import { BottomNav } from './components/BottomNav'
import { HomeScreen } from './screens/HomeScreen'
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen'
import { PlansScreen } from './screens/PlansScreen'
import { HistoryScreen } from './screens/HistoryScreen'
import { ExerciseLibraryScreen } from './screens/ExerciseLibraryScreen'

export default function App() {
  const currentScreen = useWorkoutStore(s => s.currentScreen)
  const loadActiveSession = useWorkoutStore(s => s.loadActiveSession)
  useRestTimer()

  useEffect(() => { loadActiveSession() }, [loadActiveSession])

  return (
    <div className="min-h-full bg-zinc-950 pb-20">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'active-workout' && <ActiveWorkoutScreen />}
      {currentScreen === 'plans' && <PlansScreen />}
      {currentScreen === 'history' && <HistoryScreen />}
      {currentScreen === 'exercises' && <ExerciseLibraryScreen />}
      <BottomNav />
    </div>
  )
}
