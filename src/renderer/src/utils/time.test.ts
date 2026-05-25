import { describe, expect, it } from 'vitest'
import {
  clampTimePart,
  computeRemainingMilliseconds,
  computeRemainingSeconds,
  formatSeconds,
  normalizeTimeParts
} from './time'

describe('timer time utilities', () => {
  it('formats total seconds as HH:MM:SS', () => {
    expect(formatSeconds(0)).toBe('00:00:00')
    expect(formatSeconds(59)).toBe('00:00:59')
    expect(formatSeconds(60)).toBe('00:01:00')
    expect(formatSeconds(3661)).toBe('01:01:01')
  })

  it('normalizes hours minutes and seconds into total seconds', () => {
    expect(normalizeTimeParts({ hours: 1, minutes: 2, seconds: 3 })).toBe(3723)
    expect(normalizeTimeParts({ hours: 0, minutes: 61, seconds: 90 })).toBe(3750)
  })

  it('clamps minute and second inputs to valid display ranges', () => {
    expect(clampTimePart(75, 'minutes')).toBe(59)
    expect(clampTimePart(-1, 'seconds')).toBe(0)
    expect(clampTimePart(12, 'hours')).toBe(12)
  })

  it('computes remaining seconds from an absolute end timestamp', () => {
    expect(computeRemainingSeconds(10_000, 6_200)).toBe(4)
    expect(computeRemainingSeconds(10_000, 10_001)).toBe(0)
  })

  it('computes remaining milliseconds without rounding away pause state', () => {
    expect(computeRemainingMilliseconds(10_000, 6_250)).toBe(3750)
    expect(computeRemainingMilliseconds(10_000, 10_001)).toBe(0)
  })
})
