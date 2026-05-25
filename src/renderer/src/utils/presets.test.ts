import { describe, expect, it } from 'vitest'
import {
  DEFAULT_TIMER_PRESETS,
  POMODORO_PRESETS,
  getPomodoroSessionLabel,
  getPomodoroSessionPreset,
  getNextPomodoroSession,
  type PomodoroSession
} from './presets'

describe('timer presets', () => {
  it('includes short focus, pomodoro, break, cooking, workout, and long-form durations', () => {
    expect(DEFAULT_TIMER_PRESETS.map((preset) => preset.minutes)).toEqual([
      1, 3, 5, 10, 15, 20, 25, 30, 45, 60, 90
    ])
  })

  it('exposes named pomodoro work and break presets', () => {
    expect(POMODORO_PRESETS).toEqual({
      focus: { label: 'Focus', minutes: 25 },
      shortBreak: { label: 'Short break', minutes: 5 },
      longBreak: { label: 'Long break', minutes: 15 }
    })
  })
})

describe('pomodoro session planning', () => {
  it('alternates focus and short break until the fourth completed focus earns a long break', () => {
    let session: PomodoroSession = 'focus'
    let completedFocusSessions = 0

    session = getNextPomodoroSession(session, completedFocusSessions)
    completedFocusSessions += 1
    expect(session).toBe('shortBreak')

    session = getNextPomodoroSession(session, completedFocusSessions)
    expect(session).toBe('focus')

    session = getNextPomodoroSession('focus', 3)
    expect(session).toBe('longBreak')
  })

  it('starts a new focus session after any break', () => {
    expect(getNextPomodoroSession('shortBreak', 1)).toBe('focus')
    expect(getNextPomodoroSession('longBreak', 4)).toBe('focus')
  })

  it('maps each pomodoro session to display labels and timer durations', () => {
    expect(getPomodoroSessionLabel('focus', 2)).toBe('Focus 3')
    expect(getPomodoroSessionLabel('shortBreak', 2)).toBe('Short break')
    expect(getPomodoroSessionLabel('longBreak', 4)).toBe('Long break')

    expect(getPomodoroSessionPreset('focus').minutes).toBe(25)
    expect(getPomodoroSessionPreset('shortBreak').minutes).toBe(5)
    expect(getPomodoroSessionPreset('longBreak').minutes).toBe(15)
  })
})
