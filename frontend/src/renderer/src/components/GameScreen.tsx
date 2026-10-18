import { useRef, useEffect, KeyboardEvent } from 'react'
import type { AppState } from '../state'
import { ROUND_TIME_LIMIT } from '../state'

const QUEUE_WINDOW = 14 // how many upcoming items to show in the conveyor belt

interface Props {
  state: AppState
  inputValue: string
  onInputChange: (v: string) => void
  onCheck: () => void
  onSkip: () => void
  onGiveUp: () => void
  onJumpTo: (code: number) => void
  onTogglePause: () => void
}

export default function GameScreen({
  state,
  inputValue,
  onInputChange,
  onCheck,
  onSkip,
  onGiveUp,
  onJumpTo,
  onTogglePause,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount and whenever currentIndex changes (after each correct answer)
  useEffect(() => { inputRef.current?.focus() }, [state.currentIndex])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onCheck()
    }
    // Space and Tab are handled globally in App.tsx
  }

  const currentCode = state.codes[state.currentIndex]
  const maxTime = ROUND_TIME_LIMIT[state.mode]
  const timerPct = (state.timeLeft / maxTime) * 100
  const timerClass =
    timerPct < 30 ? 'timer-fill timer-fill--red'
    : timerPct < 60 ? 'timer-fill timer-fill--yellow'
    : 'timer-fill'

  // Conveyor belt: only the current item and the next N items
  const belt = state.codes.slice(state.currentIndex, state.currentIndex + QUEUE_WINDOW)

  return (
    <div className="game-screen">

      {/* ── Left panel ── */}
      <div className="game-left">
        <div className="game-header">
          <h2 className="game-title">HTTP Status Code Quiz!</h2>
          <div className="game-badges">
            <span className="badge badge--mode">
              {state.mode === 'common' ? 'Common' : 'Complete'}
            </span>
            <span className="badge badge--score">
              {state.guessed.size} / {state.codes.length}
            </span>
          </div>
        </div>

        <div className="input-area">
          <label className="input-label">
            What is the code for <strong>&ldquo;{currentCode?.title}&rdquo;</strong>?
          </label>
          <input
            ref={inputRef}
            className="code-input"
            type="text"
            inputMode="numeric"
            placeholder={state.isPaused ? 'Paused' : 'e.g. 404'}
            value={state.isPaused ? '' : inputValue}
            onChange={e => onInputChange(e.target.value.replace(/\D/g, ''))}
            onKeyDown={handleKeyDown}
            disabled={state.isPaused}
          />
          <div className="timer-track">
            <div className={timerClass} style={{ width: `${timerPct}%` }} />
          </div>
        </div>

        {/* Conveyor belt: current item at top, upcoming below, no manual scroll */}
        <ul className="queue-list">
          {belt.map((sc, relIdx) => {
            const isCurrent = relIdx === 0
            // Fade out upcoming items gradually
            const opacity = Math.max(0.2, 1 - relIdx * 0.08)
            return (
              <li
                key={sc.code}
                className={`queue-item${isCurrent ? ' queue-item--current' : ''}`}
                style={isCurrent ? undefined : { opacity }}
              >
                <span className="queue-arrow">{isCurrent ? '▶' : ''}</span>
                <span className="queue-title">{sc.title}</span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* ── Right panel: mode-specific compact grid ── */}
      <div className="game-right">
        <h3 className="table-heading">
          {state.mode === 'common' ? 'Common' : 'Complete'} codes
          <span className="table-heading-count"> — {state.guessed.size}/{state.codes.length} guessed</span>
        </h3>
        <div className="codes-grid">
          {state.codes.map((sc, idx) => {
            const isGuessed = state.guessed.has(idx)
            const isCurrent = idx === state.currentIndex
            let cls = 'code-cell'
            if (isGuessed) cls += ' code-cell--guessed'
            if (isCurrent) cls += ' code-cell--current'
            return (
              <div
                key={sc.code}
                className={cls}
                onClick={() => onJumpTo(sc.code)}
                title="Jump to this code"
              >
                <span className={`cell-code${isGuessed ? '' : ' cell-code--hidden'}`}>{sc.code}</span>
                <span className="cell-title">{sc.title}</span>
                {isGuessed && <span className="cell-check">✓</span>}
              </div>
            )
          })}
        </div>
      </div>

      {state.isPaused && (
        <div className="pause-overlay" onClick={onTogglePause}>
          <div className="pause-card">
            <div className="pause-title">Paused</div>
            <div className="pause-subtitle">Press <kbd>P</kbd> to resume</div>
          </div>
        </div>
      )}

      {/* ── Bottom legend ── */}
      <footer className="game-legend">
        <span className="legend-item"><kbd>Esc</kbd> Main menu</span>
        <span className="legend-item"><kbd>P</kbd> {state.isPaused ? 'Resume' : 'Pause'}</span>
        <span className="legend-item"><kbd>Tab</kbd> Skip</span>
        <span className="legend-item"><kbd>Enter</kbd> Check answer</span>
        <span className="legend-item"><kbd>Space</kbd> Give up &amp; see results</span>
        <span className="legend-timer">⏱ {state.timeLeft}s</span>
      </footer>
    </div>
  )
}
