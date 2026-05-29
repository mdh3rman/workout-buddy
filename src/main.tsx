import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { seedExercises } from './db/index'
import { EXERCISES } from './db/exercises'

seedExercises(EXERCISES).catch(err => console.error('Failed to seed exercises:', err))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
