import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'

import { isRateLimited } from './rateLimit'

const options = { limit: 2, windowMs: 60_000 }
const originalNow = Date.now
let now = 0

describe('isRateLimited', () => {
  beforeEach(() => {
    // Entries from earlier tests expire before the next scenario starts.
    now += options.windowMs * 2
    Date.now = () => now
  })

  afterEach(() => {
    Date.now = originalNow
  })

  it('Should allow requests up to the limit and reject the next request', () => {
    assert.equal(isRateLimited('client', options), false)
    assert.equal(isRateLimited('client', options), false)
    assert.equal(isRateLimited('client', options), true)
  })

  it('Should expire individual hits in a sliding window', () => {
    assert.equal(isRateLimited('sliding', options), false)
    now += options.windowMs / 2
    assert.equal(isRateLimited('sliding', options), false)
    now += options.windowMs / 2
    assert.equal(isRateLimited('sliding', options), false)
    assert.equal(isRateLimited('sliding', options), true)
  })

  it('Should not extend the window when a request is rejected', () => {
    isRateLimited('blocked', options)
    isRateLimited('blocked', options)
    now += options.windowMs - 1
    assert.equal(isRateLimited('blocked', options), true)
    now += 1
    assert.equal(isRateLimited('blocked', options), false)
  })

  it('Should reject new clients at capacity without resetting existing limits', () => {
    assert.equal(isRateLimited('known', options), false)
    for (let index = 0; index < 999; index++) {
      assert.equal(isRateLimited(`capacity-${index}`, options), false)
    }

    for (let index = 0; index < 100; index++) {
      assert.equal(isRateLimited(`overflow-${index}`, options), true)
    }
    assert.equal(isRateLimited('known', options), false)
    assert.equal(isRateLimited('known', options), true)
  })

  it('Should reclaim expired capacity for new clients', () => {
    for (let index = 0; index < 1000; index++) {
      assert.equal(isRateLimited(`expiring-${index}`, options), false)
    }
    assert.equal(isRateLimited('new-client', options), true)

    now += options.windowMs
    assert.equal(isRateLimited('new-client', options), false)
  })
})
