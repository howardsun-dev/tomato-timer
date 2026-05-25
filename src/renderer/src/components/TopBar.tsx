import React from 'react'

export default function TopBar(): JSX.Element {
  return (
    <div>
      <div
        className="rounded-t-xl bg-red-700 bg-opacity-75 w-screen h-8 border-x border-t border-red-300/40 shadow-md shadow-red-950/30"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div
          id="control-buttons"
          className="text-red-50 absolute top-1 right-0 pe-2"
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
