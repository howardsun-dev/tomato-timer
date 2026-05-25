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

interface TimerProps {
  isOverlay: boolean
}

const DEFAULT_PRESETS = [5, 10, 15, 25, 45, 60]

export default function Timer({ isOverlay }: TimerProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false)
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [draftTime, setDraftTime] = useState<TimeParts>({ hours: 0, minutes: 0, seconds: 0 })
  const [isActive, setIsActive] = useState(false)
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
        void audioRef.current?.play().catch((error) => {
          console.error('Failed to play timer alarm', error)
        })
      }
    }

    tick()
    const intervalId = window.setInterval(tick, 250)

    return () => window.clearInterval(intervalId)
  }, [isActive])

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
    setDurationSeconds(nextDurationSeconds)
    setRemainingSeconds(nextDurationSeconds)
    remainingMillisecondsRef.current = nextDurationSeconds * 1000
    setIsActive(false)
    endAtRef.current = null
    setIsEditing(false)
  }

  const setPreset = (minutes: number): void => {
    const nextDurationSeconds = minutes * 60
    setDurationSeconds(nextDurationSeconds)
    setRemainingSeconds(nextDurationSeconds)
    remainingMillisecondsRef.current = nextDurationSeconds * 1000
    setIsActive(false)
    endAtRef.current = null
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
          <div className={!isOverlay ? 'flex justify-center gap-1 my-1' : 'hidden'}>
            {DEFAULT_PRESETS.map((presetMinutes) => (
              <button
                key={presetMinutes}
                className="rounded bg-black bg-opacity-20 px-2 py-1 text-xs text-stone-200 hover:text-blue-300"
                onClick={() => setPreset(presetMinutes)}
              >
                {presetMinutes < 60 ? `${presetMinutes}m` : '1h'}
              </button>
            ))}
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
