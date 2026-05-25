import { useEffect, useRef, useState } from 'react'
import InputField from './InputField'
import AlarmSound from '../assets/sounds/alarm_sound.mp3'
import {
  clampTimePart,
  computeRemainingMilliseconds,
  formatSeconds,
  normalizeTimeParts,
  secondsToTimeParts,
  type TimeParts
} from '../utils/time'
import {
  DEFAULT_TIMER_PRESETS,
  getNextPomodoroSession,
  getPomodoroSessionLabel,
  getPomodoroSessionPreset,
  type PomodoroSession,
  type TimerPreset
} from '../utils/presets'

interface TimerProps {
  isOverlay: boolean
}

export default function Timer({ isOverlay }: TimerProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false)
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [draftTime, setDraftTime] = useState<TimeParts>({ hours: 0, minutes: 0, seconds: 0 })
  const [isActive, setIsActive] = useState(false)
  const [isPomodoroMode, setIsPomodoroMode] = useState(false)
  const [pomodoroSession, setPomodoroSession] = useState<PomodoroSession>('focus')
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0)
  const [autoQueuePomodoro, setAutoQueuePomodoro] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const endAtRef = useRef<number | null>(null)
  const remainingMillisecondsRef = useRef(0)

  useEffect(() => {
    audioRef.current = new Audio(AlarmSound)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!isActive || endAtRef.current === null) {
      return undefined
    }

    const tick = (): void => {
      if (endAtRef.current === null) {
        return
      }

      const nextRemainingMilliseconds = computeRemainingMilliseconds(endAtRef.current)
      const nextRemainingSeconds = Math.ceil(nextRemainingMilliseconds / 1000)
      remainingMillisecondsRef.current = nextRemainingMilliseconds
      setRemainingSeconds(nextRemainingSeconds)

      if (nextRemainingSeconds === 0) {
        setIsActive(false)
        endAtRef.current = null
        remainingMillisecondsRef.current = 0
        void audioRef.current?.play().catch((error) => {
          console.error('Failed to play timer alarm', error)
        })

        if (isPomodoroMode && autoQueuePomodoro) {
          const nextCompletedFocusSessions =
            pomodoroSession === 'focus' ? completedFocusSessions + 1 : completedFocusSessions
          const nextSession = getNextPomodoroSession(pomodoroSession, completedFocusSessions)
          const nextPreset = getPomodoroSessionPreset(nextSession)

          setCompletedFocusSessions(nextCompletedFocusSessions)
          setPomodoroSession(nextSession)
          setDurationSeconds(nextPreset.minutes * 60)
          setRemainingSeconds(nextPreset.minutes * 60)
          remainingMillisecondsRef.current = nextPreset.minutes * 60 * 1000
        }
      }
    }

    tick()
    const intervalId = window.setInterval(tick, 250)

    return () => window.clearInterval(intervalId)
  }, [autoQueuePomodoro, completedFocusSessions, isActive, isPomodoroMode, pomodoroSession])

  const setTimerDuration = (nextDurationSeconds: number): void => {
    setDurationSeconds(nextDurationSeconds)
    setRemainingSeconds(nextDurationSeconds)
    remainingMillisecondsRef.current = nextDurationSeconds * 1000
    setIsActive(false)
    endAtRef.current = null
  }

  const applyPomodoroSession = (session: PomodoroSession): void => {
    const preset = getPomodoroSessionPreset(session)
    setPomodoroSession(session)
    setTimerDuration(preset.minutes * 60)
  }

  const updateDraftTime = (part: keyof TimeParts, value: number): void => {
    setDraftTime((currentDraft) => ({
      ...currentDraft,
      [part]: clampTimePart(value, part)
    }))
  }

  const openEditor = (): void => {
    setDraftTime(secondsToTimeParts(durationSeconds || remainingSeconds))
    setIsEditing(true)
  }

  const saveDuration = (): void => {
    const nextDurationSeconds = normalizeTimeParts(draftTime)
    setTimerDuration(nextDurationSeconds)
    setIsPomodoroMode(false)
    setIsEditing(false)
  }

  const setPreset = (preset: TimerPreset): void => {
    setIsPomodoroMode(false)
    setTimerDuration(preset.minutes * 60)
  }

  const startPomodoro = (): void => {
    setIsPomodoroMode(true)
    setCompletedFocusSessions(0)
    applyPomodoroSession('focus')
  }

  const choosePomodoroSession = (session: PomodoroSession): void => {
    setIsPomodoroMode(true)
    applyPomodoroSession(session)
  }

  const advancePomodoroSession = (): void => {
    const nextSession = getNextPomodoroSession(pomodoroSession, completedFocusSessions)
    if (pomodoroSession === 'focus') {
      setCompletedFocusSessions((currentCompleted) => currentCompleted + 1)
    }
    applyPomodoroSession(nextSession)
  }

  const startTimer = (): void => {
    const millisecondsToRun =
      remainingMillisecondsRef.current || (remainingSeconds || durationSeconds) * 1000

    if (millisecondsToRun <= 0) {
      return
    }

    audioRef.current?.pause()
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }

    endAtRef.current = Date.now() + millisecondsToRun
    remainingMillisecondsRef.current = millisecondsToRun
    setRemainingSeconds(Math.ceil(millisecondsToRun / 1000))
    setIsActive(true)
  }

  const pauseTimer = (): void => {
    if (endAtRef.current !== null) {
      const nextRemainingMilliseconds = computeRemainingMilliseconds(endAtRef.current)
      remainingMillisecondsRef.current = nextRemainingMilliseconds
      setRemainingSeconds(Math.ceil(nextRemainingMilliseconds / 1000))
    }

    endAtRef.current = null
    setIsActive(false)
  }

  const resetTimer = (): void => {
    endAtRef.current = null
    setIsActive(false)
    setRemainingSeconds(durationSeconds)
    remainingMillisecondsRef.current = durationSeconds * 1000
  }

  const stopTimer = (): void => {
    endAtRef.current = null
    setIsActive(false)
    setDurationSeconds(0)
    setRemainingSeconds(0)
    setIsPomodoroMode(false)
    setPomodoroSession('focus')
    setCompletedFocusSessions(0)
    remainingMillisecondsRef.current = 0
  }

  return (
    <>
      {isEditing ? (
        <div className="flex justify-center text-stone-200">
          <div>
            <InputField
              label="Hours: "
              value={draftTime.hours}
              onValueChange={(value) => updateDraftTime('hours', value)}
            />
            <InputField
              label="Minutes: "
              value={draftTime.minutes}
              max={59}
              onValueChange={(value) => updateDraftTime('minutes', value)}
            />
            <InputField
              label="Seconds: "
              value={draftTime.seconds}
              max={59}
              onValueChange={(value) => updateDraftTime('seconds', value)}
            />
            <button
              className="bg-blue-500 text-stone-200 px-20 py-1 rounded-xl text-xl mt-1 ml-1"
              title="save"
              aria-label="Save timer duration"
              onClick={saveDuration}
            >
              ✓
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center">
            <h1 className="text-green-500 text-6xl">{formatSeconds(remainingSeconds)}</h1>
          </div>
          <div className={!isOverlay ? 'mt-1 flex flex-wrap justify-center gap-1' : 'hidden'}>
            {DEFAULT_TIMER_PRESETS.map((preset) => (
              <button
                key={preset.label}
                className="rounded bg-black bg-opacity-20 px-2 py-1 text-xs text-stone-200 hover:text-blue-300"
                title={preset.description}
                aria-label={`Set ${preset.label} timer`}
                onClick={() => setPreset(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div
            className={
              !isOverlay ? 'my-2 rounded-lg bg-black bg-opacity-20 p-2 text-stone-200' : 'hidden'
            }
          >
            <div className="mb-2 flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-blue-200">
                {isPomodoroMode
                  ? `Pomodoro · ${getPomodoroSessionLabel(pomodoroSession, completedFocusSessions)}`
                  : 'Pomodoro'}
              </span>
              <button
                className="rounded bg-blue-500 bg-opacity-70 px-2 py-1 text-stone-100 hover:bg-opacity-90"
                aria-label="Start Pomodoro mode"
                onClick={startPomodoro}
              >
                25/5
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-1 text-xs">
              <button
                className="rounded bg-green-600 bg-opacity-60 px-2 py-1 hover:bg-opacity-90"
                aria-label="Set Pomodoro focus session"
                onClick={() => choosePomodoroSession('focus')}
              >
                Focus
              </button>
              <button
                className="rounded bg-yellow-600 bg-opacity-60 px-2 py-1 hover:bg-opacity-90"
                aria-label="Set Pomodoro short break"
                onClick={() => choosePomodoroSession('shortBreak')}
              >
                Break
              </button>
              <button
                className="rounded bg-purple-600 bg-opacity-60 px-2 py-1 hover:bg-opacity-90"
                aria-label="Set Pomodoro long break"
                onClick={() => choosePomodoroSession('longBreak')}
              >
                Long
              </button>
              <button
                className="rounded bg-black bg-opacity-30 px-2 py-1 hover:text-blue-300"
                aria-label="Advance Pomodoro session"
                disabled={!isPomodoroMode}
                onClick={advancePomodoroSession}
              >
                Next
              </button>
            </div>
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 text-xs text-stone-300">
              <input
                type="checkbox"
                checked={autoQueuePomodoro}
                onChange={(event) => setAutoQueuePomodoro(event.currentTarget.checked)}
              />
              Queue next session when timer ends
            </label>
            {isPomodoroMode ? (
              <p className="mt-1 text-center text-xs text-stone-400">
                Completed focus blocks: {completedFocusSessions}
              </p>
            ) : null}
          </div>
          <div
            id="timer-buttons"
            className={
              !isOverlay
                ? 'text-stone-500 flex justify-center bg-black bg-opacity-10 rounded-xl'
                : 'hidden'
            }
          >
            {isActive ? (
              <>
                <button
                  className="pause text-5xl text-yellow-500 m-2"
                  title="pause"
                  aria-label="Pause timer"
                  onClick={pauseTimer}
                >
                  ⏸
                </button>
                <button
                  className="stop text-5xl text-red-500 m-2"
                  title="stop"
                  aria-label="Stop timer"
                  onClick={stopTimer}
                >
                  ⏹
                </button>
              </>
            ) : (
              <>
                <button
                  className="start text-5xl text-green-500 m-2 disabled:opacity-40"
                  title="start"
                  aria-label="Start timer"
                  disabled={remainingSeconds <= 0 && durationSeconds <= 0}
                  onClick={startTimer}
                >
                  ▶
                </button>
                <button
                  className="edit text-5xl text-yellow-500 m-2"
                  title="edit"
                  aria-label="Edit timer"
                  onClick={openEditor}
                >
                  ✎
                </button>
                {durationSeconds > 0 && remainingSeconds !== durationSeconds ? (
                  <button
                    className="reset text-5xl text-blue-400 m-2"
                    title="reset"
                    aria-label="Reset timer"
                    onClick={resetTimer}
                  >
                    ↺
                  </button>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
