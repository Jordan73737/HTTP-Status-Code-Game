import { COMMON_CODES, ALL_CODES, shuffleStatusCodes, isTitleMatch, StatusCode } from './statusCodes'

export type Screen = 'start' | 'game' | 'results'
export type Mode = 'common' | 'complete'

/** Total countdown (in seconds) allowed to answer every question in a mode */
export const ROUND_TIME_LIMIT: Record<Mode, number> = {
  common: 60,
  complete: 180,
}

/** Default countdown (in seconds) for Hardcore Timed, independent of the Common/Complete code list chosen. */
export const HARDCORE_TIMED_DEFAULT = 180

export interface AppState {
  screen: Screen
  mode: Mode
  hardcore: boolean
  alternate: boolean
  codes: StatusCode[]
  currentIndex: number
  guessed: Set<number>
  skipped: Set<number>
  /** Hardcore-only: codes that were submitted wrong once and can never be retried. */
  failed: Set<number>
  timeLeft: number
  timeLimit: number
  timerEnabled: boolean
  isPaused: boolean
  elapsedSeconds: number
  /** Seconds spent on each code (by index) while it was still unresolved. */
  codeTimes: Record<number, number>
}

export const initialState: AppState = {
  screen: 'start',
  mode: 'common',
  hardcore: false,
  alternate: false,
  codes: [],
  currentIndex: 0,
  guessed: new Set(),
  skipped: new Set(),
  failed: new Set(),
  timeLeft: 0,
  timeLimit: 0,
  timerEnabled: true,
  isPaused: false,
  elapsedSeconds: 0,
  codeTimes: {},
}

export type Action =
  | { type: 'START'; mode: Mode; hardcore?: boolean; alternate?: boolean; timerEnabled?: boolean; customSeconds?: number }
  | { type: 'TICK' }
  | { type: 'CHECK'; value: number }
  | { type: 'CHECK_TEXT'; value: string }
  | { type: 'FAIL' }
  | { type: 'SKIP' }
  | { type: 'GIVE_UP' }
  | { type: 'JUMP_TO'; code: number }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESET' }

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START': {
      const baseCodes = action.mode === 'common' ? COMMON_CODES : ALL_CODES
      const codes = shuffleStatusCodes(baseCodes)
      const hardcore = action.hardcore ?? false
      const alternate = action.alternate ?? false
      const timerEnabled = action.timerEnabled ?? true
      const defaultSeconds = hardcore ? HARDCORE_TIMED_DEFAULT : ROUND_TIME_LIMIT[action.mode]
      const timeLimit = timerEnabled ? Math.max(1, action.customSeconds ?? defaultSeconds) : 0
      return {
        screen: 'game',
        mode: action.mode,
        hardcore,
        alternate,
        codes,
        currentIndex: 0,
        guessed: new Set(),
        skipped: new Set(),
        failed: new Set(),
        timeLeft: timerEnabled ? timeLimit : 0,
        timeLimit,
        timerEnabled,
        isPaused: false,
        elapsedSeconds: 0,
        codeTimes: {},
      }
    }
    case 'TICK': {
      if (state.screen !== 'game' || state.isPaused) return state
      const elapsedSeconds = state.elapsedSeconds + 1
      const idx = state.currentIndex
      const isUnresolved = !state.guessed.has(idx) && !state.failed.has(idx)
      const codeTimes = isUnresolved
        ? { ...state.codeTimes, [idx]: (state.codeTimes[idx] ?? 0) + 1 }
        : state.codeTimes
      if (!state.timerEnabled) {
        return { ...state, elapsedSeconds, codeTimes }
      }
      if (state.timeLeft <= 1) {
        return { ...state, timeLeft: 0, elapsedSeconds, codeTimes, screen: 'results', isPaused: false }
      }
      return { ...state, timeLeft: state.timeLeft - 1, elapsedSeconds, codeTimes }
    }
    case 'CHECK': {
      if (state.screen !== 'game' || state.isPaused) return state
      const currentCode = state.codes[state.currentIndex]?.code
      if (action.value !== currentCode) return state
      return advance(state, 'correct')
    }
    case 'CHECK_TEXT': {
      if (state.screen !== 'game' || state.isPaused) return state
      const currentCode = state.codes[state.currentIndex]
      if (!currentCode || !isTitleMatch(currentCode, action.value, true)) return state
      return advance(state, 'correct')
    }
    case 'FAIL': {
      // Only Hardcore mode has a concept of a failed (red, non-retryable) attempt.
      if (state.screen !== 'game' || state.isPaused || !state.hardcore) return state
      return advance(state, 'failed')
    }
    case 'SKIP': {
      if (state.screen !== 'game' || state.isPaused) return state
      return advance(state, 'skip')
    }
    case 'GIVE_UP':
      return { ...state, screen: 'results', isPaused: false }
    case 'JUMP_TO': {
      if (state.screen !== 'game' || state.isPaused) return state
      const idx = state.codes.findIndex(c => c.code === action.code)
      if (idx === -1) return state
      // Hardcore codes are locked in once failed — no jumping back for a second attempt.
      if (state.hardcore && state.failed.has(idx)) return state
      return { ...state, currentIndex: idx }
    }
    case 'TOGGLE_PAUSE': {
      if (state.screen !== 'game' || !state.timerEnabled) return state
      return { ...state, isPaused: !state.isPaused }
    }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

function advance(state: AppState, result: 'correct' | 'skip' | 'failed'): AppState {
  const newGuessed =
    result === 'correct'
      ? new Set([...state.guessed, state.currentIndex])
      : new Set(state.guessed)
  const newSkipped = new Set(state.skipped)
  const newFailed = new Set(state.failed)

  if (result === 'skip') {
    newSkipped.add(state.currentIndex)
    newFailed.delete(state.currentIndex)
  } else if (result === 'failed') {
    newFailed.add(state.currentIndex)
    newSkipped.delete(state.currentIndex)
  } else {
    newSkipped.delete(state.currentIndex)
    newFailed.delete(state.currentIndex)
  }

  // Failed codes are permanently resolved (no retry), same as guessed ones — only skipped codes come back around.
  const resolved = new Set([...newGuessed, ...newFailed])
  const nextIndex = findNextUnansweredIndex(state.codes.length, state.currentIndex, resolved)

  if (nextIndex === null) {
    return { ...state, screen: 'results', guessed: newGuessed, skipped: newSkipped, failed: newFailed, isPaused: false }
  }

  return {
    ...state,
    currentIndex: nextIndex,
    guessed: newGuessed,
    skipped: newSkipped,
    failed: newFailed,
    isPaused: false,
  }
}

function findNextUnansweredIndex(total: number, currentIndex: number, guessed: Set<number>): number | null {
  for (let offset = 1; offset <= total; offset += 1) {
    const idx = (currentIndex + offset) % total
    if (!guessed.has(idx)) return idx
  }
  return null
}
