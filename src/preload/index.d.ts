export interface TimerApi {
  closeWindow: () => void
  minimizeWindow: () => void
  onOverlayMode: (callback: (isOverlayOn: boolean) => void) => () => void
}

declare global {
  interface Window {
    timerApi: TimerApi
  }
}
