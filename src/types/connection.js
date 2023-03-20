import { Block } from './block'
import { BlockInput } from './block-input'

export class Connection {
  static None = 0
  static Prev = 1
  static Next = 2
  static Input = 3
  static Output = 4
  static Statement = 5

  /**
   * @param {Number} type
   * @param {Block} block
   * @param {BlockInput} input
   */
  constructor(type, block, input = null) {
    this.type = type
    this.block = block
    this.input = input
    this.target = null

    this.isHighlighted = false
  }

  setTarget(connection) {
    this.target = connection
  }

  setTargetsMutual(connection) {
    connection.setTarget(this)
    this.setTarget(connection)
  }

  getTargetBlock() {
    if (!this.isConnected()) return null
    return this.target.block
  }

  isHead() {
    if (!this.type == Connection.Prev) return true

    return !this.isConnected()
  }

  getHeadConnection() {
    if (this.isHead()) return this

    const prev =
      this.type == Connection.Input
        ? this.target.block.outputConnection
        : this.target.block.previousConnection
    return prev.getHeadConnection()
  }

  isTail() {
    if (!this.type == Connection.Next) return true

    return !this.isConnected()
  }

  getTailConnection() {
    if (this.isTail()) return this

    const next =
      this.type == Connection.Input
        ? this.target.block.outputConnection
        : this.target.block.nextConnection
    return next.getTailConnection()
  }

  isConnected() {
    return this.target !== null
  }

  /** @param {Connection} target */
  connect(target) {
    switch (this.type) {
      case Connection.Prev:
        this.connectPrev(target)
        break
      case Connection.Next:
      case Connection.Statement:
        this.connectNext(target)
        break
      case Connection.Input:
        this.connectInput(target)
        break
    }
  }

  /** @param {Connection} target */
  connectPrev(target) {
    if (this.isConnected()) {
      target.block.previousConnection.setTarget(this.target)
      this.target.setTarget(target)
    }

    target = target.getTailConnection()
    this.setTargetsMutual(target)
  }

  /** @param {Connection} target */
  connectNext(target) {
    if (this.isConnected()) {
      const tail = target.block.nextConnection.getTailConnection()
      tail.setTarget(this.target)
      this.target.setTarget(tail)
    }

    this.setTargetsMutual(target)
  }

  /** @param {Connection} target */
  connectInput(target) {
    this.setTargetsMutual(target)
  }

  disconnect() {
    if (!this.target) return

    const target = this.target
    this.target = null

    if (target) target.disconnect()
  }

  delete() {
    this.disconnect()
    this.block.scratch.proximity.removeConnection(this)
  }

  getPosition() {
    let rect = null
    if (this.type == Connection.Input || this.type == Connection.Statement) {
      rect = this.input.getBoundingClientRect()
    } else {
      rect = this.block.getBoundingClientRect()
    }

    let x = rect.x
    let y = rect.y

    if (this.type == Connection.Next) {
      y += rect.height
    }

    if (this.type == Connection.Input && !this.block.isInline) {
      x += rect.width
    }

    return { x, y }
  }

  canConnectTo(block) {
    if (this.block.isActive()) return false

    switch (this.type) {
      case Connection.Input:
        return !this.isConnected() && block.hasOutput()
      case Connection.Prev:
        return block.hasNext()
      case Connection.Next:
      case Connection.Statement:
        return block.hasPrev()
      default:
        return false
    }
  }

  toJSON() {
    if (!this.isConnected()) return null
    return this.getTargetBlock().id
  }
}
