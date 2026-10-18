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
  it('uses a fixed round timer for each mode instead of a per-code reset', () => {
    const common = reducer(initialState, { type: 'START', mode: 'common' })
    const complete = reducer(initialState, { type: 'START', mode: 'complete' })

    expect(common.timeLeft).toBe(60)
    expect(complete.timeLeft).toBe(120)

    const jumped = reducer(complete, { type: 'JUMP_TO', code: complete.codes[2].code })
    expect(jumped.timeLeft).toBe(complete.timeLeft)
  })

  it('supports pausing and resuming during a round', () => {
    const started = reducer(initialState, { type: 'START', mode: 'common' })
    const paused = reducer(started, { type: 'TOGGLE_PAUSE' })
    const resumed = reducer(paused, { type: 'TOGGLE_PAUSE' })

    expect(paused.isPaused).toBe(true)
    expect(resumed.isPaused).toBe(false)
  })
})
