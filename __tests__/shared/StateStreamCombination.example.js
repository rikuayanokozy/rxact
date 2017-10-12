import setup from '../../src/setup'
import teardown from '../../src/teardown'
import StateStream from '../../src/StateStream'

export default (Observable) => {
  beforeAll(() => {
    setup(Observable)
  })

  afterAll(() => {
    teardown()
  })

  describe('StateStream combination', () => {
    it('throw if stateStream is invalid', () => {
      expect(() => {
        const source = new StateStream('source', '')
        new StateStream('stream', '', [source])
      }).not.toThrow()

      expect(() => {
        const source = new StateStream('source', '')
        const stream = new StateStream('stream', '', [source])
        new StateStream('stream', '', [source, stream])
      }).not.toThrow()

      expect(() => {
        const source = new StateStream('source', '')
        new StateStream('stream', '', ['', source])
      }).toThrow()
    })

    it('throw if stateStreams have same name', () => {
      const sourceA = new StateStream('streamA', 'A')
      const sourceB = new StateStream('streamA', 'B')
      expect(() => {
        new StateStream('stream', null, [sourceA, sourceB])
      }).toThrow()
    })

    it('combine all stateStreams together', () => {
      const streamA = new StateStream('streamA', 'A')
      const streamB = new StateStream('streamB', 'B')
      const streamC = new StateStream('streamC', 'C')

      const stream = new StateStream(
        'stream', 'stream1', [streamA, streamB, streamC]
      )
      const stream2 = new StateStream('stream2', 'stream2', [stream, streamA])

      stream.state$.subscribe(state => {
        expect(state).toEqual({
          streamA: 'A', streamB: 'B', streamC: 'C', 'stream': 'stream1'
        })
      })

      stream2.state$.subscribe(state => {
        expect(state).toEqual({
          stream: {
            streamA: 'A',
            streamB: 'B',
            streamC: 'C',
            stream: 'stream1',
          },
          streamA: 'A',
          stream2: 'stream2',
        })
      })
    })

    it('observe new state when emitting state to sources', () => {
      const sourceA = new StateStream('sourceA', 'A')
      const sourceB = new StateStream('sourceB', 'B')
      const sourceC = new StateStream('sourceC', 'C')
      const stream = new StateStream(
        'stream', 'source', [sourceA, sourceB, sourceC]
      )

      const mockCalls = [
        [{ sourceA: 'A', sourceB: 'B', sourceC: 'C', stream: 'source' }],
        [{ sourceA: 'AA', sourceB: 'B', sourceC: 'C', stream: 'source' }],
        [{ sourceA: 'AA', sourceB: 'BB', sourceC: 'C', stream: 'source' }],
        [{ sourceA: 'AA', sourceB: 'BB', sourceC: 'CC', stream: 'source' }],
      ]

      const mockSubscriber = jest.fn()
      stream.state$.subscribe(mockSubscriber)

      sourceA.next(() => 'AA')
      sourceB.next(() => 'BB')
      sourceC.next(() => 'CC')

      expect(mockSubscriber.mock.calls).toEqual(mockCalls)
    })
  })
}