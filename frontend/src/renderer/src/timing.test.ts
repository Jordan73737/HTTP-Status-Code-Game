import { describe, expect, it } from 'vitest'
import { reducer, initialState } from './state'
import { isPerfectRun, runKey, slowRecallIndexes, formatDuration } from './timing'

function startGame(overrides: { hardcore?: boolean } = {}) {
  return reducer(initialState, { type: 'START', mode: 'common', timerEnabled: false, ...overrides })
}

describe('per-code timing', () => {
  it('credits each tick to the current unresolved code', () => {
    let s = startGame()
    const idx = s.currentIndex
    s = reducer(s, { type: 'TICK' })
    s = reducer(s, { type: 'TICK' })
    expect(s.codeTimes[idx]).toBe(2)
    expect(s.elapsedSeconds).toBe(2)
  })

  it('stops charging time to a code once it is answered', () => {
    let s = startGame()
    const idx = s.currentIndex
    s = reducer(s, { type: 'TICK' })
    s = reducer(s, { type: 'CHECK', value: s.codes[idx].code })
    expect(s.codeTimes[idx]).toBe(1)

    s = reducer(s, { type: 'JUMP_TO', code: s.codes[idx].code })
    s = reducer(s, { type: 'TICK' })
    expect(s.codeTimes[idx]).toBe(1)
  })

  it('keeps accumulating time on a skipped code when it comes back around', () => {
    let s = startGame()
    const first = s.currentIndex
    s = reducer(s, { type: 'TICK' })
    s = reducer(s, { type: 'SKIP' })
    expect(s.currentIndex).not.toBe(first)
    s = reducer(s, { type: 'JUMP_TO', code: s.codes[first].code })
    s = reducer(s, { type: 'TICK' })
    expect(s.codeTimes[first]).toBe(2)
  })

  it('does not charge time to a failed hardcore code', () => {
    let s = startGame({ hardcore: true })
    const failedIdx = s.currentIndex
    s = reducer(s, { type: 'FAIL' })
    const nextIdx = s.currentIndex
    expect(nextIdx).not.toBe(failedIdx)
    s = reducer(s, { type: 'JUMP_TO', code: s.codes[failedIdx].code })
    expect(s.currentIndex).toBe(nextIdx)
    s = reducer(s, { type: 'TICK' })
    expect(s.codeTimes[failedIdx]).toBeUndefined()
    expect(s.codeTimes[nextIdx]).toBe(1)
  })

  it('resets code times when a new game starts', () => {
    let s = startGame()
    s = reducer(s, { type: 'TICK' })
    s = startGame()
    expect(s.codeTimes).toEqual({})
  })
})

describe('slowRecallIndexes', () => {
  it('flags correct codes at or above 1.5x the average', () => {
    const guessed = new Set([0, 1, 2, 3])
    const codeTimes = { 0: 2, 1: 2, 2: 2, 3: 8 }
    // average = 3.5, threshold = 5.25
    expect([...slowRecallIndexes(codeTimes, guessed)]).toEqual([3])
  })

  it('flags nothing when every code took the same time', () => {
    const guessed = new Set([0, 1, 2])
    expect(slowRecallIndexes({ 0: 3, 1: 3, 2: 3 }, guessed).size).toBe(0)
  })

  it('ignores codes that were not answered correctly', () => {
    const guessed = new Set([0, 1])
    const codeTimes = { 0: 2, 1: 2, 2: 50 }
    expect(slowRecallIndexes(codeTimes, guessed).size).toBe(0)
  })

  it('needs at least two correct answers to compare', () => {
    expect(slowRecallIndexes({ 0: 10 }, new Set([0])).size).toBe(0)
  })
})

describe('best time keys and perfect runs', () => {
  it('separates runs by mode and modifiers', () => {
    const base = { mode: 'common' as const, hardcore: false, alternate: false, timerEnabled: true }
    expect(runKey(base)).not.toBe(runKey({ ...base, mode: 'complete' }))
    expect(runKey(base)).not.toBe(runKey({ ...base, hardcore: true }))
    expect(runKey(base)).not.toBe(runKey({ ...base, alternate: true }))
    expect(runKey(base)).not.toBe(runKey({ ...base, timerEnabled: false }))
  })

  it('only counts a run as perfect when every code was answered correctly', () => {
    const s = startGame()
    expect(isPerfectRun(s)).toBe(false)
    const full = { ...s, guessed: new Set(s.codes.map((_, i) => i)) }
    expect(isPerfectRun(full)).toBe(true)
  })
})

describe('formatDuration', () => {
  it('formats seconds and minutes', () => {
    expect(formatDuration(42)).toBe('42s')
    expect(formatDuration(125)).toBe('2m 5s')
  })
})
