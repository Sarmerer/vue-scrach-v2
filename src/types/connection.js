import { Constraints } from '../renderers/aphrodite/constraints'
import { Block } from './block'
import { BlockInput } from './block-input'
import { Point } from './point'

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
    this.shadow = null

    this.position = new Point()
  }

  setTarget(connection) {
    this.target = connection
  }

  setTargetsMutual(connection) {
    connection.setTarget(this)
    this.setTarget(connection)
  }

  /** @returns {Block | null} */
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
        this.connectNext(target)
        break
      case Connection.Statement:
        this.connectNext(target)
        break
      case Connection.Input:
        this.connectInput(target)
        break
      default:
        return
    }

    this.block.scratch.renderer.update(this.block, { propagateUp: true })
  }

  /** @param {Block} block */
  connectToBlock(block) {
    const connection = this.getMatchingBlockConnection(block)
    if (!connection) return

    this.connect(connection)
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

  /**
   * @param {Block} block
   * @returns {Block}
   */
  createShadow(block) {
    if (this.shadow?.type === block.type) return

    this.disposeShadow()

    const shadow = this.block.scratch.getBlockOfType(block.type)
    if (!shadow) return

    shadow.isShadow = true
    this.shadow = shadow
    this.block.scratch.addBlock(shadow)

    // FIXME: find a better way to
    // position shadow above the target block
    // without relying on constraints
    // of a specific renderer
    if (this.type == Connection.Prev) {
      shadow.position.moveTo(
        this.block.position.x,
        this.block.position.y - shadow.height + Constraints.StackSocketDepth
      )
    }

    this.connectToBlock(shadow)

    return shadow
  }

  heal() {
    const target = this.getTargetBlock()
    this.disconnect()

    if (!target?.isShadow) return
    if (!target.nextConnection?.isConnected()) return

    if (!(this.type == Connection.Next || this.type == Connection.Statement))
      return

    this.connect(target.nextConnection.target)
  }

  disposeShadow() {
    if (!this.shadow) return

    this.heal()
    const shadow = this.shadow
    this.shadow = null

    this.block.scratch.removeBlock(shadow)
  }

  disconnect() {
    if (!this.isConnected()) return

    const target = this.target
    this.target = null
    target.disconnect()

    this.block.scratch.renderer.update(this.block, { propagateUp: true })
  }

  dispose() {
    this.disposeShadow()
    this.disconnect()
    this.block.scratch.proximity.removeConnection(this)
  }

  /** @param {Block} block */
  getMatchingBlockConnection(block) {
    switch (this.type) {
      case Connection.Prev:
        return block.nextConnection
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
  canConnectTo(block) {
    if (this.block.isActive()) return false

    switch (this.type) {
      case Connection.Input:
        return !this.isConnected() && block.hasOutput()
      case Connection.Prev:
        return !this.isConnected() && block.hasNext()
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
