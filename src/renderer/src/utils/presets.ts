export interface TimerPreset {
  label: string
  minutes: number
  description?: string
}

export type PomodoroSession = 'focus' | 'shortBreak' | 'longBreak'

export const DEFAULT_TIMER_PRESETS: TimerPreset[] = [
  { label: '1m', minutes: 1, description: 'Tiny reset' },
  { label: '3m', minutes: 3, description: 'Tea steep' },
  { label: '5m', minutes: 5, description: 'Short break' },
  { label: '10m', minutes: 10, description: 'Quick task' },
  { label: '15m', minutes: 15, description: 'Planning block' },
  { label: '20m', minutes: 20, description: 'Focus sprint' },
  { label: '25m', minutes: 25, description: 'Pomodoro focus' },
  { label: '30m', minutes: 30, description: 'Deep work' },
  { label: '45m', minutes: 45, description: 'Long focus' },
  { label: '1h', minutes: 60, description: 'Hour block' },
  { label: '90m', minutes: 90, description: 'Deep-work cycle' }
]

export const POMODORO_PRESETS: Record<PomodoroSession, TimerPreset> = {
  focus: { label: 'Focus', minutes: 25 },
  shortBreak: { label: 'Short break', minutes: 5 },
  longBreak: { label: 'Long break', minutes: 15 }
}

export function getNextPomodoroSession(
  currentSession: PomodoroSession,
  completedFocusSessions: number
): PomodoroSession {
  if (currentSession !== 'focus') {
    return 'focus'
  }

  return (completedFocusSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak'
}

export function getPomodoroSessionPreset(session: PomodoroSession): TimerPreset {
  return POMODORO_PRESETS[session]
}

export function getPomodoroSessionLabel(
  session: PomodoroSession,
  completedFocusSessions: number
): string {
  if (session === 'focus') {
    return `Focus ${completedFocusSessions + 1}`
  }

  return POMODORO_PRESETS[session].label
}
