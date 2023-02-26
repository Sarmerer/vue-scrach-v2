import { Scratch } from './scratch'
import { Block } from './block'
import { Connection } from './connection'

export class Proximity {
  /** @param {Scratch} scratch */
  constructor(scratch) {
    this.scratch = scratch
    this.connections = []

    this.activeBlock = null
    this.activeBlockConnection = null
    this.matchingConnections = []

    this.candidate = null
  }

  addConnection(connection) {
    this.connections.push(connection)
  }

  removeConnection(connection) {
    const index = this.connections.indexOf(connection)
    if (index == -1) return

    this.connections.splice(index, 1)
  }

  cacheMatchingConnections() {
    this.matchingConnections = this.connections.filter((c) => {
      return c.canConnectTo(this.activeBlock)
    })
  }

  prepare(block) {
    this.activeBlock = block
    this.cacheMatchingConnections(block)
  }

  /** @param {Block} block */
  update() {
    if (!this.activeBlock) return
    if (!this.matchingConnections.length) return

    this.setCandidate(null)

    let minDist = 100
    let candidate = null
    for (const connection of this.matchingConnections) {
      let activeConnection = null

      if (connection.type == Connection.Prev && !connection.isConnected()) {
        activeConnection = this.activeBlock.nextConnection.getTailConnection()
      } else if (
        connection.type == Connection.Next ||
        connection.type == Connection.Statement
      ) {
        activeConnection = this.activeBlock.previousConnection
      } else if (connection.type == Connection.Input) {
        activeConnection = this.activeBlock.outputConnection
      }

      if (!activeConnection) continue

      const aPos = activeConnection.getPosition()
      const cPos = connection.getPosition()
      const yDist = Math.abs(cPos.y - aPos.y)
      const xDist = Math.abs(cPos.x - aPos.x)

      if (yDist >= minDist || yDist > 30 || xDist > 50) continue

      minDist = yDist
      candidate = connection
      this.activeBlockConnection = activeConnection
    }

    if (!candidate) return

    this.setCandidate(candidate)
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

  reset() {
    if (this.candidate) {
      this.candidate.connect(this.activeBlockConnection)
      this.setCandidate(null)
    }

    this.activeBlock = null
    this.activeBlockConnection = null
    this.candidate = null
    this.matchingConnections = []
  }
}
