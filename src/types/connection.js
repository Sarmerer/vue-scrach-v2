import { Block } from './block'
import { BlockInput } from './block-input'
import { Point } from './point'
import { Scratch } from './scratch'

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

    this.position = new Point()
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
    const oldTarget = target.target
    const oldParent = target.getTargetBlock()

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
      default:
        return
    }

    this.block.scratch.events.dispatch(Scratch.Events.BLOCK_MOVE, {
      connection: target,
      block: target.block,
      oldTarget,
      oldParent,
      newTarget: this,
      newParent: this.block,
    })
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
    if (!this.isConnected()) return

    const target = this.target
    this.target = null

    if (target) target.disconnect()

    this.block.scratch.events.dispatch(Scratch.Events.BLOCK_MOVE, {
      connection: this,
      block: this.block,
      oldTarget: target,
      oldParent: target.block,
      newParent: null,
      newTarget: null,
    })
  }

  delete() {
    this.disconnect()
    this.block.scratch.proximity.removeConnection(this)
  }

  getPosition() {
    return this.position
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
