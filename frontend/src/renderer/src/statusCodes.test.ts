import { describe, expect, it } from 'vitest'
import { reducer, initialState } from './state'
import { ALL_CODES, COMMON_CODES, isTitleMatch, shuffleStatusCodes } from './statusCodes'

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

  it('counts down for the whole round instead of resetting after each answer', () => {
    const started = reducer(initialState, { type: 'START', mode: 'common', timerEnabled: true, customSeconds: 60 })
    const ticked = reducer(started, { type: 'TICK' })
    const firstCode = ticked.codes[ticked.currentIndex].code

    const answered = reducer(ticked, { type: 'CHECK', value: firstCode })

    expect(ticked.timeLeft).toBe(59)
    // Answering a question must not refill the clock — it's a single countdown for the whole quiz.
    expect(answered.timeLeft).toBe(59)
  })

  it('tracks elapsed time even when the countdown timer is disabled', () => {
    const started = reducer(initialState, { type: 'START', mode: 'common', timerEnabled: false })
    expect(started.elapsedSeconds).toBe(0)

    const tickedOnce = reducer(started, { type: 'TICK' })
    const tickedTwice = reducer(tickedOnce, { type: 'TICK' })

    expect(tickedOnce.elapsedSeconds).toBe(1)
    expect(tickedTwice.elapsedSeconds).toBe(2)
    expect(tickedTwice.timeLeft).toBe(0)
  })

  it('keeps counting elapsed time alongside the countdown and stops when paused', () => {
    const started = reducer(initialState, { type: 'START', mode: 'common', timerEnabled: true, customSeconds: 60 })
    const ticked = reducer(started, { type: 'TICK' })
    const paused = reducer(ticked, { type: 'TOGGLE_PAUSE' })
    const tickedWhilePaused = reducer(paused, { type: 'TICK' })

    expect(ticked.elapsedSeconds).toBe(1)
    expect(tickedWhilePaused.elapsedSeconds).toBe(1)
    expect(tickedWhilePaused.timeLeft).toBe(ticked.timeLeft)
  })

  it('ignores jump-to-code clicks while paused so the paused round stays unchanged', () => {
    const started = reducer(initialState, { type: 'START', mode: 'common', timerEnabled: true, customSeconds: 60 })
    const paused = reducer(started, { type: 'TOGGLE_PAUSE' })
    const target = paused.codes[5].code
    const jumped = reducer(paused, { type: 'JUMP_TO', code: target })

    expect(jumped).toBe(paused)
    expect(jumped.currentIndex).toBe(paused.currentIndex)
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

describe('isTitleMatch', () => {
  it('matches the title case-insensitively, ignoring surrounding whitespace', () => {
    const notFound = ALL_CODES.find(c => c.code === 404)!
    expect(isTitleMatch(notFound, 'not found')).toBe(true)
    expect(isTitleMatch(notFound, '  NOT FOUND  ')).toBe(true)
    expect(isTitleMatch(notFound, 'not here')).toBe(false)
  })

  it('accepts either accepted name for codes with multiple common titles (306)', () => {
    const code306 = ALL_CODES.find(c => c.code === 306)!
    expect(isTitleMatch(code306, 'Switch Proxy')).toBe(true)
    expect(isTitleMatch(code306, 'unused')).toBe(true)
    expect(isTitleMatch(code306, 'Switch Proxy / UNUSED')).toBe(false)
  })

  it('ignores spacing, hyphens and punctuation for exact matches', () => {
    const notFound = ALL_CODES.find(c => c.code === 404)!
    expect(isTitleMatch(notFound, 'notfound')).toBe(true)
    expect(isTitleMatch(notFound, 'not-found')).toBe(true)
  })

  it('only accepts typos when allowed, and only within the title allowance', () => {
    const loop = ALL_CODES.find(c => c.code === 508)!
    expect(isTitleMatch(loop, 'Loop Detcted')).toBe(false)
    expect(isTitleMatch(loop, 'Loop Detcted', true)).toBe(true)
    expect(isTitleMatch(loop, 'Loop Dtected', true)).toBe(true)
    expect(isTitleMatch(loop, 'Lop Dettected', true)).toBe(true)
    expect(isTitleMatch(loop, 'Loop Dtectd xx', true)).toBe(false)
    expect(isTitleMatch(loop, 'Loop', true)).toBe(false)
  })

  it('gives short titles no typo leeway', () => {
    const gone = ALL_CODES.find(c => c.code === 410)!
    expect(isTitleMatch(gone, 'Gnoe', true)).toBe(false)
    expect(isTitleMatch(gone, 'Gone', true)).toBe(true)
  })
})

describe('hardcore mode', () => {
  it('fails and locks in a code on a wrong submission, advancing without allowing a retry', () => {
    const started = reducer(initialState, { type: 'START', mode: 'common', hardcore: true, timerEnabled: false })
    const firstIndex = started.currentIndex

    const failed = reducer(started, { type: 'FAIL' })

    expect(failed.failed.has(firstIndex)).toBe(true)
    expect(failed.currentIndex).not.toBe(firstIndex)

    // Jumping back to the failed code must not be possible — no second attempts in Hardcore.
    const jumpAttempt = reducer(failed, { type: 'JUMP_TO', code: started.codes[firstIndex].code })
    expect(jumpAttempt.currentIndex).toBe(failed.currentIndex)
  })

  it('ignores FAIL outside of hardcore mode', () => {
    const started = reducer(initialState, { type: 'START', mode: 'common', hardcore: false, timerEnabled: false })
    const failed = reducer(started, { type: 'FAIL' })
    expect(failed).toEqual(started)
  })

  it('defaults Hardcore Timed to 180 seconds when no custom duration is given', () => {
    const started = reducer(initialState, { type: 'START', mode: 'common', hardcore: true, timerEnabled: true })
    expect(started.timeLimit).toBe(180)
  })
})

describe('alternate mode', () => {
  it('advances on a matching typed title and ignores a non-matching one', () => {
    const started = reducer(initialState, { type: 'START', mode: 'common', alternate: true, timerEnabled: false })
    const correctTitle = started.codes[started.currentIndex].title

    const wrong = reducer(started, { type: 'CHECK_TEXT', value: 'definitely wrong' })
    expect(wrong).toEqual(started)

    const right = reducer(started, { type: 'CHECK_TEXT', value: correctTitle.toUpperCase() })
    expect(right.guessed.has(started.currentIndex)).toBe(true)
  })
})
