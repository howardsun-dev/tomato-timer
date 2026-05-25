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
        <div className="flex justify-center text-red-50">
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
              className="bg-red-600 bg-opacity-85 text-red-50 px-20 py-1 rounded-xl text-xl mt-1 ml-1 border border-red-200/40 shadow-sm shadow-red-950/40 hover:bg-red-500"
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
            <h1 className="text-red-100 text-6xl drop-shadow-[0_0_10px_rgba(248,113,113,0.65)]">
              {formatSeconds(remainingSeconds)}
            </h1>
          </div>
          <div className={!isOverlay ? 'mt-1 flex flex-wrap justify-center gap-1' : 'hidden'}>
            {DEFAULT_TIMER_PRESETS.map((preset) => (
              <button
                key={preset.label}
                className="rounded bg-red-800 bg-opacity-45 px-2 py-1 text-xs text-red-50 border border-red-300/25 hover:bg-red-600 hover:text-white"
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
              !isOverlay
                ? 'my-2 rounded-lg bg-red-900 bg-opacity-35 p-2 text-red-50 border border-red-400/20'
                : 'hidden'
            }
          >
            <div className="mb-2 flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-red-100">
                {isPomodoroMode
                  ? `Pomodoro · ${getPomodoroSessionLabel(pomodoroSession, completedFocusSessions)}`
                  : 'Pomodoro'}
              </span>
              <button
                className="rounded bg-red-600 bg-opacity-75 px-2 py-1 text-red-50 border border-red-200/30 hover:bg-opacity-95"
                aria-label="Start Pomodoro mode"
                onClick={startPomodoro}
              >
                25/5
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-1 text-xs">
              <button
                className="rounded bg-lime-700 bg-opacity-55 px-2 py-1 text-lime-50 border border-lime-200/25 hover:bg-opacity-85"
                aria-label="Set Pomodoro focus session"
                onClick={() => choosePomodoroSession('focus')}
              >
                Focus
              </button>
              <button
                className="rounded bg-amber-700 bg-opacity-55 px-2 py-1 text-amber-50 border border-amber-200/25 hover:bg-opacity-85"
                aria-label="Set Pomodoro short break"
                onClick={() => choosePomodoroSession('shortBreak')}
              >
                Break
              </button>
              <button
                className="rounded bg-red-700 bg-opacity-55 px-2 py-1 text-red-50 border border-red-200/25 hover:bg-opacity-85"
                aria-label="Set Pomodoro long break"
                onClick={() => choosePomodoroSession('longBreak')}
              >
                Long
              </button>
              <button
                className="rounded bg-red-950 bg-opacity-45 px-2 py-1 text-red-50 border border-red-300/20 hover:bg-red-700 disabled:opacity-45"
                aria-label="Advance Pomodoro session"
                disabled={!isPomodoroMode}
                onClick={advancePomodoroSession}
              >
                Next
              </button>
            </div>
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 text-xs text-red-100">
              <input
                type="checkbox"
                checked={autoQueuePomodoro}
                onChange={(event) => setAutoQueuePomodoro(event.currentTarget.checked)}
              />
              Queue next session when timer ends
            </label>
            {isPomodoroMode ? (
              <p className="mt-1 text-center text-xs text-red-200">
                Completed focus blocks: {completedFocusSessions}
              </p>
            ) : null}
          </div>
          <div
            id="timer-buttons"
            className={
              !isOverlay
                ? 'text-red-100 flex justify-center bg-red-900 bg-opacity-35 rounded-xl border border-red-400/20'
                : 'hidden'
            }
          >
            {isActive ? (
              <>
                <button
                  className="pause text-5xl text-amber-200 m-2 drop-shadow-[0_0_8px_rgba(253,230,138,0.45)]"
                  title="pause"
                  aria-label="Pause timer"
                  onClick={pauseTimer}
                >
                  ⏸
                </button>
                <button
                  className="stop text-5xl text-red-300 m-2 drop-shadow-[0_0_8px_rgba(252,165,165,0.55)]"
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
                  className="start text-5xl text-lime-200 m-2 disabled:opacity-40 drop-shadow-[0_0_8px_rgba(217,249,157,0.45)]"
                  title="start"
                  aria-label="Start timer"
                  disabled={remainingSeconds <= 0 && durationSeconds <= 0}
                  onClick={startTimer}
                >
                  ▶
                </button>
                <button
                  className="edit text-5xl text-amber-200 m-2 drop-shadow-[0_0_8px_rgba(253,230,138,0.45)]"
                  title="edit"
                  aria-label="Edit timer"
                  onClick={openEditor}
                >
                  ✎
                </button>
                {durationSeconds > 0 && remainingSeconds !== durationSeconds ? (
                  <button
                    className="reset text-5xl text-red-200 m-2 drop-shadow-[0_0_8px_rgba(254,202,202,0.45)]"
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
