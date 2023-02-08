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

    this.isCached = false
    this.isHighlighted = false
  }

  cache() {
    if (this.isCached || !this.shouldProcess()) return

    this.block.scratch.proximity.addConnection(this)
    this.isCached = true
  }

  setTarget(connection) {
    this.target = connection
  }

  getTargetBlock() {
    if (!this.isConnected()) return null
    return this.target.block
  }

  isTail() {
    if (!this.type == Connection.Next || this.type == Connection.Input)
      return true

    return !this.isConnected()
  }

  getTailConnection() {
    if (this.isTail()) return this

    const next =
      this.type == Connection.Input
        ? this.target.block.outputBlock
        : this.target.block.nextBlock
    return next.getTailConnection()
  }

  isConnected() {
    return this.target !== null
  }

  /** @param {Connection} target */
  connect(target) {
    if (this.type == Connection.Prev) {
      this.connectPrev(target)
    } else if (
      this.type == Connection.Next ||
      this.type == Connection.Statement
    ) {
      this.connectNext(target)
    } else if (this.type == Connection.Input) {
      this.connectInput(target)
    }
  }

  /** @param {Connection} target */
  connectPrev(target) {
    if (this.isConnected()) {
      target.block.prevBlock.setTarget(this.target)
      this.target.setTarget(target)
    }

    target = target.getTailConnection()
    this.setTarget(target)
    target.setTarget(this)
  }

  /** @param {Connection} target */
  connectNext(target) {
    if (this.isConnected()) {
      const tail = target.block.nextBlock.getTailConnection()
      tail.setTarget(this.target)
      this.target.setTarget(tail)
    }

    this.setTarget(target)
    target.setTarget(this)
  }

  /** @param {Connection} target */
  connectInput(target) {
    if (this.isConnected()) {
      console.log(this.input.id)
    }

    this.setTarget(target)
    target.setTarget(this)
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

  shouldProcess() {
    switch (this.type) {
      case Connection.None:
        return false
      case Connection.Prev:
        return this.block.hasPrev()
      case Connection.Next:
        return this.block.hasNext()
      case Connection.Output:
        return this.block.hasOutput()
      case Connection.Input:
        return this.input?.type == 'Value'
      case Connection.Statement:
        return this.input?.type == 'Statement'
    }
  }

  canConnectTo(block) {
    if (this.block.isActive()) return false

    switch (this.type) {
      case Connection.Input:
        return block.hasOutput()
      case Connection.Prev:
        return block.hasNext()
      case Connection.Statement:
      case Connection.Next:
        return block.hasPrev()
      default:
        return false
    }
  }
}
