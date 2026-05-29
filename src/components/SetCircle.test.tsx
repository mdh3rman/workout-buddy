import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SetCircle } from './SetCircle'

describe('SetCircle', () => {
  it('renders reps count', () => {
    render(<SetCircle reps={5} targetReps={5} completedAt={null} onTap={vi.fn()} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onTap when clicked', () => {
    const onTap = vi.fn()
    render(<SetCircle reps={5} targetReps={5} completedAt={null} onTap={onTap} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onTap).toHaveBeenCalledOnce()
  })

  it('applies pending styles when completedAt is null', () => {
    render(<SetCircle reps={5} targetReps={5} completedAt={null} onTap={vi.fn()} />)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border-dashed')
  })

  it('applies completed styles when completedAt is set and reps === targetReps', () => {
    render(<SetCircle reps={5} targetReps={5} completedAt="2026-05-01T10:00:00Z" onTap={vi.fn()} />)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-orange-500')
  })

  it('applies failed styles when reps < targetReps', () => {
    render(<SetCircle reps={4} targetReps={5} completedAt="2026-05-01T10:00:00Z" onTap={vi.fn()} />)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-red-950')
  })
})
