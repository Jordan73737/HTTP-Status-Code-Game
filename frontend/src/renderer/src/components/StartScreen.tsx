import { useEffect, useRef, useState } from 'react'
import type { Mode } from '../state'
import { ROUND_TIME_LIMIT } from '../state'
import { COMMON_CODES, ALL_CODES } from '../statusCodes'

interface Props {
  onStart: (mode: Mode, timerEnabled: boolean, customSeconds?: number) => void
  onViewCodes: () => void
}

// Ignore Escape-to-quit for a short window after mount so a trailing keydown
// left over from backing out of a quiz can't immediately quit the app.
const QUIT_GUARD_MS = 500

export default function StartScreen({ onStart, onViewCodes }: Props) {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null)
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [customSeconds, setCustomSeconds] = useState<number | ''>(ROUND_TIME_LIMIT.common)
  const mountedAtRef = useRef(Date.now())

  useEffect(() => {
    if (selectedMode) {
      setCustomSeconds(ROUND_TIME_LIMIT[selectedMode])
    }
  }, [selectedMode])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return // ignore OS key-repeat so a held key can't double-fire across a screen transition
      if (e.key === 'Enter' && selectedMode) onStart(selectedMode, timerEnabled, timerEnabled ? Math.max(1, customSeconds || 1) : undefined)
      if (e.key === 'Escape') {
        if (selectedMode) {
          // Back out of the timer-selection sub-screen instead of quitting
          setSelectedMode(null)
        } else if (Date.now() - mountedAtRef.current > QUIT_GUARD_MS) {
          window.api?.quitApp()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onStart, selectedMode, timerEnabled, customSeconds])

  const handleSelectMode = (mode: Mode) => {
    setSelectedMode(mode)
  }

  const handleConfirmStart = () => {
    if (!selectedMode) return
    onStart(selectedMode, timerEnabled, timerEnabled ? Math.max(1, customSeconds || 1) : undefined)
  }

  return (
    <div className="start-screen">
      <div className="start-content">
        <h1 className="start-title">HTTP Status Code Quiz!</h1>
        <p className="start-subtitle">
          You'll see the status code <em>title</em> - type its numeric code to score.
        </p>

        {selectedMode && (
          <div className="timer-options">
            <div className="timer-option-row">
              <label className="timer-choice">
                <input
                  type="radio"
                  name="timer-choice"
                  checked={!timerEnabled}
                  onChange={() => setTimerEnabled(false)}
                />
                <span>No Timer</span>
              </label>
              <label className="timer-choice">
                <input
                  type="radio"
                  name="timer-choice"
                  checked={timerEnabled}
                  onChange={() => setTimerEnabled(true)}
                />
                <span>Timer</span>
              </label>
            </div>

            {timerEnabled && (
              <label className="timer-input-row">
                <span>Seconds for this quiz</span>
                <input
                  type="number"
                  min={1}
                  value={customSeconds}
                  onChange={e => {
                    const raw = e.target.value
                    setCustomSeconds(raw === '' ? '' : Math.max(0, Number(raw)))
                  }}
                  onBlur={() => setCustomSeconds(prev => (prev === '' || prev < 1 ? 1 : prev))}
                />
              </label>
            )}

            {timerEnabled && (
              <p className="timer-note">
                Default timers: <strong>Common</strong> {ROUND_TIME_LIMIT.common}s · <strong>Complete</strong> {ROUND_TIME_LIMIT.complete}s
              </p>
            )}

            <button className="start-quiz-btn" onClick={handleConfirmStart}>
              Start {selectedMode === 'common' ? 'Common' : 'Complete'} Quiz →
            </button>
          </div>
        )}

        <div className="mode-grid">
          <button
            className={`mode-card${selectedMode === 'common' ? ' mode-card--selected' : ''}`}
            onClick={() => handleSelectMode('common')}
          >
            <div className="mode-card-label">Common Codes</div>
            <div className="mode-card-count">{COMMON_CODES.length} codes</div>
            <div className="mode-card-timer">Default: {ROUND_TIME_LIMIT.common}s</div>
          </button>
          <button
            className={`mode-card${selectedMode === 'complete' ? ' mode-card--selected' : ''}`}
            onClick={() => handleSelectMode('complete')}
          >
            <div className="mode-card-label">Complete List</div>
            <div className="mode-card-count">{ALL_CODES.length} codes</div>
            <div className="mode-card-timer">Default: {ROUND_TIME_LIMIT.complete}s</div>
          </button>
        </div>
        <button className="codes-ref-btn" onClick={onViewCodes}>
          HTTP Codes Revision →
        </button>
        <p className="start-hint">
          {selectedMode
            ? <>Press <kbd>Enter</kbd> to start {selectedMode === 'common' ? 'Common' : 'Complete'} · <kbd>Esc</kbd> to go back</>
            : <>Select a quiz mode to continue · <kbd>Esc</kbd> to quit</>}
        </p>
      </div>
    </div>
  )
}
