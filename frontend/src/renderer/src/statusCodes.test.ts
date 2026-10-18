import { describe, expect, it } from 'vitest'
import { reducer, initialState } from './state'
import { COMMON_CODES, shuffleStatusCodes } from './statusCodes'

describe('shuffleStatusCodes', () => {
  it('randomizes the short quiz order instead of keeping the static array sequence', () => {
    const shuffled = shuffleStatusCodes(COMMON_CODES, () => 0)

    expect(shuffled).not.toEqual(COMMON_CODES)
    expect(shuffled).toHaveLength(COMMON_CODES.length)
    expect(shuffled.map(code => code.code).sort()).toEqual(COMMON_CODES.map(code => code.code).sort())
  })
})

describe('round timer rules', () => {
  it('uses the default round timer values and keeps the complete round at 180 seconds', () => {
    const common = reducer(initialState, { type: 'START', mode: 'common' })
    const complete = reducer(initialState, { type: 'START', mode: 'complete' })

    expect(common.timeLeft).toBe(60)
    expect(common.timerEnabled).toBe(true)
    expect(complete.timeLeft).toBe(180)
    expect(complete.timerEnabled).toBe(true)
  })

  it('supports disabling the timer and pausing the round', () => {
    const noTimer = reducer(initialState, { type: 'START', mode: 'complete', timerEnabled: false })
    const started = reducer(initialState, { type: 'START', mode: 'common', timerEnabled: true, customSeconds: 45 })
    const paused = reducer(started, { type: 'TOGGLE_PAUSE' })
    const resumed = reducer(paused, { type: 'TOGGLE_PAUSE' })

    expect(noTimer.timerEnabled).toBe(false)
    expect(noTimer.timeLeft).toBe(0)
    expect(paused.isPaused).toBe(true)
    expect(resumed.isPaused).toBe(false)
  })

  it('revisits skipped codes before ending the round', () => {
    const started = reducer(initialState, { type: 'START', mode: 'common', timerEnabled: false })
    const lastIndex = started.codes.length - 1
    const missed = new Set([1, 2, 3])
    const state = {
      ...started,
      currentIndex: lastIndex,
      guessed: new Set(
        Array.from({ length: started.codes.length }, (_, index) => index).filter(index => !missed.has(index) && index !== lastIndex),
      ),
      skipped: missed,
      timeLeft: 0,
      timeLimit: 0,
      timerEnabled: false,
    }

    const next = reducer(state, { type: 'CHECK', value: started.codes[lastIndex].code })

    expect(next.screen).toBe('game')
    expect(next.currentIndex).toBe(1)
    expect(next.guessed.has(lastIndex)).toBe(true)
  })
})
