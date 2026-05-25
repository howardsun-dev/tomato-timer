export type TimePart = 'hours' | 'minutes' | 'seconds'

export interface TimeParts {
  hours: number
  minutes: number
  seconds: number
}

export function clampTimePart(value: number, part: TimePart): number {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0

  if (part === 'hours') {
    return safeValue
  }

  return Math.min(safeValue, 59)
}

export function normalizeTimeParts({ hours, minutes, seconds }: TimeParts): number {
  const safeHours = Number.isFinite(hours) ? Math.max(0, Math.floor(hours)) : 0
  const safeMinutes = Number.isFinite(minutes) ? Math.max(0, Math.floor(minutes)) : 0
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0

  return safeHours * 3600 + safeMinutes * 60 + safeSeconds
}

export function secondsToTimeParts(totalSeconds: number): TimeParts {
  const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0

  return {
    hours: Math.floor(safeSeconds / 3600),
    minutes: Math.floor((safeSeconds % 3600) / 60),
    seconds: safeSeconds % 60
  }
}

export function computeRemainingSeconds(endAt: number, now: number = Date.now()): number {
  return Math.ceil(computeRemainingMilliseconds(endAt, now) / 1000)
}

export function computeRemainingMilliseconds(endAt: number, now: number = Date.now()): number {
  return Math.max(0, endAt - now)
}

export function formatSeconds(totalSeconds: number): string {
  const { hours, minutes, seconds } = secondsToTimeParts(totalSeconds)

  return [hours, minutes, seconds].map((value) => value.toString().padStart(2, '0')).join(':')
}
