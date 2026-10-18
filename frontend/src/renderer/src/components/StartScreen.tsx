import { useEffect } from 'react'
import type { Mode } from '../state'
import { COMMON_CODES, ALL_CODES } from '../statusCodes'

interface Props {
  onStart: (mode: Mode) => void
  onViewCodes: () => void
}

export default function StartScreen({ onStart, onViewCodes }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onStart('common')
      if (e.key === 'Escape') window.api?.quitApp()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onStart])

  return (
    <div className="start-screen">
      <div className="start-content">
        <h1 className="start-title">HTTP Status Code Quiz!</h1>
        <p className="start-subtitle">
          You'll see the status code <em>title</em> — type its numeric code to score.
        </p>
        <div className="mode-grid">
          <button className="mode-card" onClick={() => onStart('common')}>
            <div className="mode-card-label">Common Codes</div>
            <div className="mode-card-count">{COMMON_CODES.length} codes</div>
            <div className="mode-card-timer">1:00 round</div>
          </button>
          <button className="mode-card" onClick={() => onStart('complete')}>
            <div className="mode-card-label">Complete List</div>
            <div className="mode-card-count">{ALL_CODES.length} codes</div>
            <div className="mode-card-timer">2:00 round</div>
          </button>
        </div>
        <button className="codes-ref-btn" onClick={onViewCodes}>
          HTTP Codes Revision →
        </button>
        <p className="start-hint">Press <kbd>Enter</kbd> to start Common · <kbd>Esc</kbd> to quit</p>
      </div>
    </div>
  )
}
