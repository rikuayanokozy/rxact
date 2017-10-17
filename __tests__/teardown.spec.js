import Observable from 'zen-observable'
import StateStream from '../src/stateStream'
import { getObservable } from '../src/observable'
import setup from '../src/setup'
import teardown from '../src/teardown'

describe('teardown', () => {
  beforeEach(() => {
    setup({ Observable })
  })

  it('remove Obserable configuration', () => {
    teardown()

    expect(() => getObservable()).toThrow()
  })

  it('remove plugins', () => {
    StateStream.plugins = [() => {}]

    teardown()

    expect(StateStream.plugins.length).toBe(0)
  })
})
