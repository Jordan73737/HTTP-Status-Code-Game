import type { AppState } from './state'

/** Best elapsed seconds per quiz setup, keyed by `runKey`. */
export type BestTimes = Record<string, number>

const STORAGE_KEY = 'httpCodeGame.bestTimes'

/** A correctly answered code is "slow to recall" when it took at least this multiple of the run's average. */
export const SLOW_RECALL_MULTIPLIER = 1.5

/** Identifies a quiz setup. Runs with the same key compete for the same time to beat. */
export function runKey(state: Pick<AppState, 'mode' | 'hardcore' | 'alternate' | 'timerEnabled'>): string {
  return [
    state.mode,
    state.hardcore ? 'hardcore' : 'normal',
    state.alternate ? 'alternate' : 'code',
    state.timerEnabled ? 'timed' : 'untimed',
  ].join('|')
}

/** A run counts toward best times only when every code was answered correctly. */
export function isPerfectRun(state: Pick<AppState, 'codes' | 'guessed'>): boolean {
  return state.codes.length > 0 && state.guessed.size === state.codes.length
}

export function loadBestTimes(): BestTimes {
  if (typeof localStorage === 'undefined') return {}
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? (parsed as BestTimes) : {}
  } catch {
    return {}
  }
}

export function saveBestTime(key: string, seconds: number): BestTimes {
  const next = { ...loadBestTimes(), [key]: seconds }
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage may be full or disabled; the in-memory best still applies for this session.
    }
  }
  return next
}

/** Indexes of correctly answered codes that took much longer than the run's average. */
export function slowRecallIndexes(codeTimes: Record<number, number>, guessed: Set<number>): Set<number> {
  const entries = [...guessed].map(idx => [idx, codeTimes[idx] ?? 0] as const)
  const slow = new Set<number>()
  if (entries.length < 2) return slow
  const average = entries.reduce((sum, [, t]) => sum + t, 0) / entries.length
  for (const [idx, t] of entries) {
    if (t > 0 && t >= average * SLOW_RECALL_MULTIPLIER) slow.add(idx)
  }
  return slow
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}
