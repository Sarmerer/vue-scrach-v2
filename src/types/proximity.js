import { Scratch } from './scratch'
import { Block } from './block'
import { Connection } from './connection'

export class Proximity {
  /** @param {Scratch} scratch */
  constructor(scratch) {
    this.scratch = scratch
    this.connections = []

    this.activeBlock = null
    this.bestActiveConnection = null

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

  /**
   * @param {Connection} connection
   * @param {Block} block
   * */
  getMatchingConnection(connection, block) {
    switch (connection.type) {
      case Connection.Prev:
        if (connection.isConnected()) return null
        return block.nextConnection.getTailConnection()
      case Connection.Next:
      case Connection.Statement:
        return block.previousConnection
      case Connection.Input:
        return block.outputConnection
      default:
        return null
    }
  }

  /** @param {Block} block */
  activate(block) {
    this.activeBlock = block
    this.candidates = this.getCandidates(block)
  }

  /** @param {Block} block */
  update() {
    if (!this.activeBlock || !this.candidates.length) return

    this.setCandidate(null)

    let minDist = 100
    let closestConnection = null
    for (const connection of this.candidates) {
      let activeConnection = this.getMatchingConnection(
        connection,
        this.activeBlock
      )
      if (!activeConnection) continue

      const activePosition = activeConnection.getPosition()
      const candidatePosition = connection.getPosition()
      const yDist = Math.abs(candidatePosition.y - activePosition.y)
      const xDist = Math.abs(candidatePosition.x - activePosition.x)

      if (yDist >= minDist || yDist > 30 || xDist > 50) continue

      minDist = yDist
      closestConnection = connection
      this.bestActiveConnection = activeConnection
    }

    if (!closestConnection) {
      this.bestActiveConnection = null
      return
    }

    this.setCandidate(closestConnection)
  }

  setCandidate(candidate) {
    if (this.candidate) {
      this.candidate.isHighlighted = false
    }

    this.candidate = candidate

    if (this.candidate) {
      this.candidate.isHighlighted = true
    }
  }

  deactivate() {
    if (this.candidate) {
      this.candidate.connect(this.bestActiveConnection)
      this.setCandidate(null)
    }

    this.activeBlock = null
    this.bestActiveConnection = null
    this.candidate = null
    this.candidates = []
  }
}
