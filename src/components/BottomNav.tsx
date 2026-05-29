import { Home, ClipboardList, Play, History, Dumbbell } from 'lucide-react'
import { useWorkoutStore } from '../store/workoutStore'
import type { Screen } from '../types'

export function BottomNav() {
  const currentScreen = useWorkoutStore(s => s.currentScreen)
  const setScreen = useWorkoutStore(s => s.setScreen)
  const activeSession = useWorkoutStore(s => s.activeSession)
  const startSession = useWorkoutStore(s => s.startSession)

  const handleCenter = () => {
    if (activeSession) {
      setScreen('active-workout')
    } else {
      startSession()
    }
  }

  const tab = (screen: Screen, Icon: React.ElementType, label: string) => (
    <button
      key={screen}
      onClick={() => setScreen(screen)}
      className={`flex flex-col items-center gap-1 flex-1 py-2 ${
        currentScreen === screen ? 'text-orange-500' : 'text-zinc-500'
      }`}
    >
      <Icon size={20} />
      <span className="text-[10px]">{label}</span>
    </button>
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-zinc-900 border-t border-zinc-800 flex items-center">
      {tab('home', Home, 'Home')}
      {tab('plans', ClipboardList, 'Plans')}
      <div className="flex-1 flex justify-center py-2">
        <button
          onClick={handleCenter}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-orange-500"
        >
          <Play size={20} className="text-white fill-white" />
        </button>
      </div>
      {tab('history', History, 'History')}
      {tab('exercises', Dumbbell, 'Exercises')}
    </nav>
  )
}
