import { useEffect } from 'react'
import type { AppState } from '../state'

interface Props {
  state: AppState
  onPlayAgain: () => void
  onMenu: () => void
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

export default function ResultsScreen({ state, onPlayAgain, onMenu }: Props) {
  const { codes, guessed, skipped, elapsedSeconds, timerEnabled, timeLeft } = state
  const correct = guessed.size
  const total = codes.length
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const timedOut = timerEnabled && timeLeft <= 0 && guessed.size + skipped.size < total

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.key === 'Escape') onMenu()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onMenu])

  return (
    <div className="results-screen">
      <div className="results-content">
        <h1 className="results-title">Results</h1>

        <div className="results-score-row">
          <span className="results-big">{correct}</span>
          <span className="results-sep">/ {total}</span>
          <span className="results-pct">{pct}%</span>
        </div>

        <p className="results-time">
          ⏱ Time taken: <strong>{formatDuration(elapsedSeconds)}</strong>
          {timedOut && ' (ran out of time)'}
        </p>

        <div className="results-table-wrap">
          <table className="results-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((sc, idx) => {
                const isGuessed = guessed.has(idx)
                const isSkipped = skipped.has(idx)
                const cls = isGuessed
                  ? 'rrow rrow--correct'
                  : isSkipped
                  ? 'rrow rrow--skipped'
                  : 'rrow rrow--timeout'
                return (
                  <tr key={sc.code} className={cls}>
                    <td>{sc.code}</td>
                    <td>{sc.title}</td>
                    <td>
                      {isGuessed ? '✓ Correct' : isSkipped ? '→ Skipped' : '✗ Timed out'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="results-actions">
          <button className="btn-primary" onClick={onPlayAgain}>Play Again</button>
          <button className="btn-secondary" onClick={onMenu}>Main Menu</button>
        </div>
      </div>
    </div>
  )
}
