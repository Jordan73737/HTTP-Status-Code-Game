import { COMMON_CODES, ALL_CODES, shuffleStatusCodes, StatusCode } from './statusCodes'

export type Screen = 'start' | 'game' | 'results'
export type Mode = 'common' | 'complete'

/** Round-based countdown settings for each mode */
export const ROUND_TIME_LIMIT: Record<Mode, number> = {
  common: 60,
  complete: 180,
}

export const TIME_PER_CODE = ROUND_TIME_LIMIT

export interface AppState {
  screen: Screen
  mode: Mode
  codes: StatusCode[]
  currentIndex: number
  guessed: Set<number>
  skipped: Set<number>
  timeLeft: number
  timeLimit: number
  timerEnabled: boolean
  isPaused: boolean
}

export const initialState: AppState = {
  screen: 'start',
  mode: 'common',
  codes: [],
  currentIndex: 0,
  guessed: new Set(),
  skipped: new Set(),
  timeLeft: 0,
  timeLimit: 0,
  timerEnabled: true,
  isPaused: false,
}

export type Action =
  | { type: 'START'; mode: Mode; timerEnabled?: boolean; customSeconds?: number }
  | { type: 'TICK' }
  | { type: 'CHECK'; value: number }
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
      const timerEnabled = action.timerEnabled ?? true
      const timeLimit = timerEnabled ? Math.max(1, action.customSeconds ?? ROUND_TIME_LIMIT[action.mode]) : 0
      return {
        screen: 'game',
        mode: action.mode,
        codes,
        currentIndex: 0,
        guessed: new Set(),
        skipped: new Set(),
        timeLeft: timerEnabled ? timeLimit : 0,
        timeLimit,
        timerEnabled,
        isPaused: false,
      }
    }
    case 'TICK': {
      if (state.screen !== 'game' || state.isPaused || !state.timerEnabled) return state
      if (state.timeLeft <= 1) {
        return { ...state, timeLeft: 0, screen: 'results', isPaused: false }
      }
      return { ...state, timeLeft: state.timeLeft - 1 }
    }
    case 'CHECK': {
      if (state.screen !== 'game' || state.isPaused) return state
      const currentCode = state.codes[state.currentIndex]?.code
      if (action.value !== currentCode) return state
      return advance(state, 'correct')
    }
    case 'SKIP': {
      if (state.screen !== 'game' || state.isPaused) return state
      return advance(state, 'skip')
    }
    case 'GIVE_UP':
      return { ...state, screen: 'results', isPaused: false }
    case 'JUMP_TO': {
      if (state.screen !== 'game') return state
      const idx = state.codes.findIndex(c => c.code === action.code)
      if (idx === -1) return state
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

function advance(state: AppState, result: 'correct' | 'skip'): AppState {
  const newGuessed =
    result === 'correct'
      ? new Set([...state.guessed, state.currentIndex])
      : new Set(state.guessed)
  const newSkipped = new Set(state.skipped)

  if (result === 'skip') {
    newSkipped.add(state.currentIndex)
  } else {
    newSkipped.delete(state.currentIndex)
  }

  const nextIndex = findNextUnansweredIndex(state.codes.length, state.currentIndex, newGuessed)

  if (nextIndex === null) {
    return { ...state, screen: 'results', guessed: newGuessed, skipped: newSkipped, isPaused: false }
  }

  return {
    ...state,
    currentIndex: nextIndex,
    guessed: newGuessed,
    skipped: newSkipped,
    timeLeft: state.timerEnabled ? state.timeLimit : 0,
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
