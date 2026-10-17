import { describe, expect, it } from 'vitest'
import { COMMON_CODES, shuffleStatusCodes } from './statusCodes'

describe('shuffleStatusCodes', () => {
  it('randomizes the short quiz order instead of keeping the static array sequence', () => {
    const shuffled = shuffleStatusCodes(COMMON_CODES, () => 0)

    expect(shuffled).not.toEqual(COMMON_CODES)
    expect(shuffled).toHaveLength(COMMON_CODES.length)
    expect(shuffled.map(code => code.code).sort()).toEqual(COMMON_CODES.map(code => code.code).sort())
  })
})
