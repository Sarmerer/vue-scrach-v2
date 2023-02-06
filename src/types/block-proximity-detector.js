import { Scratch } from './scratch'
import { Block } from './block'
import { BlockStatementInput, BlockValueInput } from './block-input'

export class BlockProximityDetector {
  /** @param {Scratch} scratch */
  constructor(scratch) {
    this.scratch = scratch

    this.current = null
    this.next = null
    this.prev = null
    this.input = null

    this.cRect = null
    this.bRect = null
  }

  /** @param {Block} currentBlock */
  update(currentBlock) {
    if (!currentBlock) return

    this.current = currentBlock
    this.cRect = this.current.getBoundingClientRect()

    for (const block of this.current.scratch.blocks) {
      if (block.id == this.current.id) continue

      this.bRect = block.getBoundingClientRect()
      if (
        this.cRect.x > this.bRect.x + this.bRect.width + 30 ||
        this.cRect.x + this.cRect.width < this.bRect.x - 30 ||
        this.cRect.y > this.bRect.y + this.bRect.height + 30 ||
        this.cRect.y + this.cRect.height < this.bRect.y - 30
      ) {
        this.clear(block)
        continue
      }

      this.updateStackProximity(block)
      this.updateInputsProximity(block)
    }
  }

  /**
   * @param {Number} proximity
   * @param {Number} threshold
   * @returns {Boolean}
   */
  isProximate(proximity, threshold = 20) {
    return !(proximity < -threshold || proximity > threshold)
  }

  /**
   * @param {DOMRect} r1
   * @param {DOMRect} r2
   * @returns {Boolean}
   */
  topBottomDist(r1, r2) {
    return r1.y - (r2.y + r2.height)
  }

  /**
   * @param {DOMRect} r1
   * @param {DOMRect} r2
   * @returns {Boolean}
   */
  bottomToTopDist(r1, r2) {
    return r1.y + r1.height - r2.y
  }

  /** @param {Block} block */
  updateStackProximity(block) {
    if (!this.isProximate(this.cRect.x - this.bRect.x, 50)) {
      this.clear(block)
      return
    }

    if (
      block.hasNext &&
      this.current.hasPrev &&
      this.isProximate(this.topBottomDist(this.cRect, this.bRect))
    ) {
      this.clear()
      this.prev = block
      return
    }

    if (
      block.hasPrev &&
      this.current.hasNext &&
      this.isProximate(this.bottomToTopDist(this.cRect, this.bRect))
    ) {
      this.clear()
      this.next = block
      return
    }

    this.clear(block)
  }

  /** @param {Block} block */
  updateInputsProximity(block) {
    let minDist = 100
    let closest = null
    for (const input of block.inputs) {
      let values = []
      switch (input.type) {
        case 'Value':
          values = this.getValueProximity(input)
          break
        case 'Statement':
          values = this.getStatementProximity(input)
          break
        default:
          continue
      }

      if (!values.length) continue

      const dist = Math.min(...values)
      if (dist > minDist) continue

      minDist = dist
      closest = input
    }

    if (!closest) return

    this.clear()
    this.input = closest
  }

  /** @param {BlockValueInput} input */
  getValueProximity(input) {
    if (!this.current.hasOutput) return []

    const vRect = input.getBoundingClientRect()
    if (!this.isProximate(vRect.x + vRect.width - this.cRect.x, 30)) {
      return []
    }

    const values = []
    const topHalf = vRect.y - this.cRect.y - 10
    const bottomHalf =
      this.cRect.y + this.cRect.height - (vRect.y + vRect.height) - 10
    if (this.isProximate(topHalf)) {
      values.push(topHalf)
    }

    if (this.isProximate(bottomHalf)) {
      values.push(bottomHalf)
    }

    return values
  }

  /** @param {BlockStatementInput} input */
  getStatementProximity(input) {
    if (!this.current.hasPrev) return []

    const sRect = input.getBoundingClientRect()
    if (!this.isProximate(this.cRect.x - sRect.x, 50)) {
      return []
    }

    let values = []
    const topTopDist = this.cRect.y - sRect.y
    if (this.isProximate(topTopDist)) {
      values.push(topTopDist)
    }

    return values
  }

  resolve() {
    if (!this.current) {
      this.reset()
      return
    }

    if (this.prev) {
      this.current.setPrev(this.prev)
    }

    if (this.next) {
      this.current.setNext(this.next)
    }

    if (this.input) {
      this.current.setInputOf(this.input)
    }

    this.reset()
  }

  clear(relativeTo = null) {
    if (!relativeTo || relativeTo.id == this.prev?.id) {
      this.prev = null
    }

    if (!relativeTo || relativeTo.id == this.next?.id) {
      this.next = null
    }

    if (
      !relativeTo ||
      relativeTo.id == this.input?.id ||
      relativeTo.id == this.input?.block?.id
    ) {
      this.input = null
    }
  }

  reset() {
    this.clear()
    this.cRect = null
    this.bRect = null
    this.current = null
  }
}
