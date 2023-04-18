import { Scratch } from './scratch'
import { Block } from './block'
import { Connection } from './connection'

export class Proximity {
  /** @param {Scratch} scratch */
  constructor(scratch) {
    this.scratch = scratch
    this.connections = []

    this.activeBlock = null
    this.candidates = []
    this.candidate = null
  }

  /** @param {Connection} connection */
  addConnection(connection) {
    this.connections.push(connection)
  }

  /** @param {Connection} connection */
  removeConnection(connection) {
    const index = this.connections.indexOf(connection)
    if (index == -1) return

    this.connections.splice(index, 1)
  }

  /** @param {Block} block */
  getCandidates(block) {
    return this.connections.filter((c) => {
      return c.canConnectTo(block)
    })
  }

  getClosestConnection(block, candidates) {
    let closestConnection = null
    let minYDist = 100
    for (const candidate of candidates) {
      let blockConnection = candidate.getMatchingBlockConnection(block)
      if (!blockConnection) continue

      const blockPosition = blockConnection.position
      const candidatePosition = candidate.position
      const yDist = Math.abs(candidatePosition.y - blockPosition.y)
      const xDist = Math.abs(candidatePosition.x - blockPosition.x)

      if (yDist > 30 || xDist > 50) continue
      if (yDist > minYDist) continue

      minYDist = yDist
      closestConnection = candidate
    }

    return closestConnection
  }

  /** @param {Block} block */
  activate(block) {
    if (this.activeBlock || !block) return

    this.activeBlock = block
    this.candidates = this.getCandidates(this.activeBlock)
  }

  /** @param {Block} block */
  update(block) {
    this.activate(block)

    if (!this.activeBlock || !this.candidates.length) return

    const closestConnection = this.getClosestConnection(
      this.activeBlock,
      this.candidates
    )

    this.setCandidate(closestConnection)
  }

  isSameCandidate(oldCandidate, newCandidate) {
    if ((!!oldCandidate ^ !!newCandidate) === 1) return true

    return oldCandidate !== newCandidate
  }

  setCandidate(candidate) {
    if (!this.isSameCandidate(this.candidate, candidate)) return

    this.candidate?.disposeShadow()
    candidate?.createShadow(this.activeBlock)
    this.candidate = candidate
  }

  deactivate() {
    const candidate = this.candidate
    const activeBlock = this.activeBlock

    this.activeBlock = null
    this.setCandidate(null)
    this.candidates = []

    if (candidate && activeBlock) {
      candidate.connectToBlock(activeBlock)
    }
  }
}
