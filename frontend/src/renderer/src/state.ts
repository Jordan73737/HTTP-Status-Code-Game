import { COMMON_CODES, ALL_CODES, shuffleStatusCodes, StatusCode } from './statusCodes'

export type Screen = 'start' | 'game' | 'results'
export type Mode = 'common' | 'complete'

/** UAT-tunable: seconds per code before auto-skip */
export const TIME_PER_CODE: Record<Mode, number> = {
  common: 15,
  complete: 45,
}

export interface AppState {
  screen: Screen
  mode: Mode
  codes: StatusCode[]
  currentIndex: number
  guessed: Set<number>
  skipped: Set<number>
  timeLeft: number
}

export const initialState: AppState = {
  screen: 'start',
  mode: 'common',
  codes: [],
  currentIndex: 0,
  guessed: new Set(),
  skipped: new Set(),
  timeLeft: 0,
}

export type Action =
  | { type: 'START'; mode: Mode }
  | { type: 'TICK' }
  | { type: 'CHECK'; value: number }
  | { type: 'SKIP' }
  | { type: 'GIVE_UP' }
  | { type: 'JUMP_TO'; code: number }
  | { type: 'RESET' }

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START': {
      const baseCodes = action.mode === 'common' ? COMMON_CODES : ALL_CODES
      const codes = shuffleStatusCodes(baseCodes)
      return {
        screen: 'game',
        mode: action.mode,
        codes,
        currentIndex: 0,
        guessed: new Set(),
        skipped: new Set(),
        timeLeft: TIME_PER_CODE[action.mode],
      }
    }
    case 'TICK': {
      if (state.screen !== 'game') return state
      if (state.timeLeft <= 1) return advance(state, 'skip')
      return { ...state, timeLeft: state.timeLeft - 1 }
    }
    case 'CHECK': {
      if (state.screen !== 'game') return state
      const currentCode = state.codes[state.currentIndex]?.code
      if (action.value !== currentCode) return state
      return advance(state, 'correct')
    }
    case 'SKIP': {
      if (state.screen !== 'game') return state
      return advance(state, 'skip')
    }
    case 'GIVE_UP':
      return { ...state, screen: 'results' }
    case 'JUMP_TO': {
      if (state.screen !== 'game') return state
      const idx = state.codes.findIndex(c => c.code === action.code)
      if (idx === -1) return state
      return { ...state, currentIndex: idx, timeLeft: TIME_PER_CODE[state.mode] }
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
      : state.guessed
  const newSkipped =
    result === 'skip'
      ? new Set([...state.skipped, state.currentIndex])
      : state.skipped
  const nextIndex = state.currentIndex + 1
  if (nextIndex >= state.codes.length) {
    return { ...state, screen: 'results', guessed: newGuessed, skipped: newSkipped }
  }
  return {
    ...state,
    currentIndex: nextIndex,
    guessed: newGuessed,
    skipped: newSkipped,
    timeLeft: TIME_PER_CODE[state.mode],
  }
}
