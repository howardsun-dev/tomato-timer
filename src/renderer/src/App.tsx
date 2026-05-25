import { useEffect, useState } from 'react'
import TopBar from './components/TopBar'
import Timer from './components/Timer'

function App(): JSX.Element {
  const [isOverlay, setIsOverlay] = useState(false)

  useEffect(() => {
    return window.timerApi.onOverlayMode((isOverlayOn) => {
      setIsOverlay(isOverlayOn)
    })
  }, [])

  return (
    <>
      <div className={!isOverlay ? 'visible' : 'invisible'}>
        <TopBar />
      </div>
      <div
        className={
          !isOverlay
            ? 'bg-red-950 bg-opacity-55 p-2 rounded-b-xl border-x border-b border-red-400/30 shadow-lg shadow-red-950/30'
            : 'bg-red-950 bg-opacity-55 p-2 rounded-xl border border-red-400/30 shadow-lg shadow-red-950/30'
        }
      >
        <Timer isOverlay={isOverlay} />
      </div>
    </>
  )
}

export default App
