import { useEffect } from 'react'
import type { AppState } from '../state'
import { formatDuration, slowRecallIndexes } from '../timing'

interface Props {
  state: AppState
  /** Time to beat for this quiz setup. Equals the run's own time when it sets a new best. */
  timeToBeat: number | null
  isNewBest: boolean
  onPlayAgain: () => void
  onMenu: () => void
}

export default function ResultsScreen({ state, timeToBeat, isNewBest, onPlayAgain, onMenu }: Props) {
  const { codes, guessed, skipped, failed, elapsedSeconds, timerEnabled, timeLeft, codeTimes } = state
  const correct = guessed.size
  const total = codes.length
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const timedOut = timerEnabled && timeLeft <= 0 && guessed.size + skipped.size + failed.size < total
  const slow = slowRecallIndexes(codeTimes, guessed)

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

        <div className="results-times">
          <p className="results-time">
            ⏱ Time taken: <strong>{formatDuration(elapsedSeconds)}</strong>
            {timedOut && ' (ran out of time)'}
          </p>
          <p className="results-time">
            🏁 Time to beat: <strong>{timeToBeat !== null ? formatDuration(timeToBeat) : '—'}</strong>
            {isNewBest && <span className="badge badge--new-best">New best!</span>}
          </p>
        </div>

        {slow.size > 0 && (
          <p className="results-hint">
            <span className="results-hint-swatch" /> Highlighted codes took much longer than average to recall
          </p>
        )}

        <div className="results-table-wrap">
          <table className="results-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Time</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((sc, idx) => {
                const isGuessed = guessed.has(idx)
                const isFailed = failed.has(idx)
                const isSkipped = skipped.has(idx)
                const isSlow = slow.has(idx)
                const cls = isGuessed
                  ? `rrow rrow--correct${isSlow ? ' rrow--slow' : ''}`
                  : isFailed
                  ? 'rrow rrow--failed'
                  : isSkipped
                  ? 'rrow rrow--skipped'
                  : 'rrow rrow--timeout'
                return (
                  <tr key={sc.code} className={cls}>
                    <td>{sc.code}</td>
                    <td>{sc.title}</td>
                    <td>{codeTimes[idx] ?? 0}s</td>
                    <td>
                      {isGuessed ? '✓ Correct' : isFailed ? '✗ Failed' : isSkipped ? '→ Skipped' : '✗ Timed out'}
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
