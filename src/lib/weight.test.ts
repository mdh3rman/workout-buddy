import { describe, it, expect } from 'vitest'
import { adjustWeight, defaultWeight, formatWeight, stepSize } from './weight'

describe('stepSize', () => {
  it('returns 2.5 for barbell', () => expect(stepSize('barbell')).toBe(2.5))
  it('returns 1.25 for dumbbell', () => expect(stepSize('dumbbell')).toBe(1.25))
  it('returns 2.5 for cable', () => expect(stepSize('cable')).toBe(2.5))
  it('returns 5 for machine', () => expect(stepSize('machine')).toBe(5))
  it('returns 0 for bodyweight', () => expect(stepSize('bodyweight')).toBe(0))
})

describe('adjustWeight', () => {
  it('increases barbell by 2.5', () => expect(adjustWeight(60, 'barbell', 1)).toBe(62.5))
  it('decreases barbell by 2.5', () => expect(adjustWeight(60, 'barbell', -1)).toBe(57.5))
  it('does not go below barbell minimum of 20', () => expect(adjustWeight(20, 'barbell', -1)).toBe(20))
  it('increases dumbbell by 1.25', () => expect(adjustWeight(10, 'dumbbell', 1)).toBe(11.25))
  it('does not go below dumbbell minimum of 1.25', () => expect(adjustWeight(1.25, 'dumbbell', -1)).toBe(1.25))
  it('returns 0 for bodyweight', () => expect(adjustWeight(0, 'bodyweight', 1)).toBe(0))
})

describe('defaultWeight', () => {
  it('returns 20 for barbell', () => expect(defaultWeight('barbell')).toBe(20))
  it('returns 10 for dumbbell', () => expect(defaultWeight('dumbbell')).toBe(10))
  it('returns 20 for cable', () => expect(defaultWeight('cable')).toBe(20))
  it('returns 20 for machine', () => expect(defaultWeight('machine')).toBe(20))
  it('returns 0 for bodyweight', () => expect(defaultWeight('bodyweight')).toBe(0))
})

describe('formatWeight', () => {
  it('formats kg weight', () => expect(formatWeight(60, 'barbell')).toBe('60 kg'))
  it('formats dumbbell', () => expect(formatWeight(11.25, 'dumbbell')).toBe('11.25 kg'))
  it('returns BW for bodyweight', () => expect(formatWeight(0, 'bodyweight')).toBe('BW'))
})
