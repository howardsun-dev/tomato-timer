import React from 'react'

export default function TopBar(): JSX.Element {
  return (
    <div>
      <div
        className="rounded-t-xl bg-blue-400 w-screen h-8"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div
          id="control-buttons"
          className="text-stone-200 absolute top-1 right-0 pe-2"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <button
            id="minimize"
            aria-label="Minimize window"
            onClick={window.timerApi.minimizeWindow}
          >
            −
          </button>
          <button id="close" aria-label="Close window" onClick={window.timerApi.closeWindow}>
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
