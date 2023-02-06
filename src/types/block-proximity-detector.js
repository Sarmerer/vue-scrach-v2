import { Scratch } from './scratch'
import { Block } from './block'

export class BlockProximityDetector {
  /**
   * @param {Block} block
   * @param {Scratch} scratch
   */
  constructor(block) {
    this.block = block

    this.next = null
    this.prev = null
    this.input = null

    this.rect = null
    this.bRect = null
  }

  update() {
    this.rect = this.block.getBoundingClientRect()

    for (const block of this.block.scratch.blocks) {
      if (block.id == this.block.id) continue

      this.bRect = block.getBoundingClientRect()
      if (
        this.rect.x > this.bRect.x + this.bRect.width + 15 ||
        this.rect.x + this.rect.width < this.bRect.x - 15 ||
        this.rect.y > this.bRect.y + this.bRect.height + 15 ||
        this.rect.y + this.rect.height < this.bRect.y - 15
      ) {
        this.clear(block)
        continue
      }

      this.updateStackProximity(block)
      this.updateInputsProximity(block)
    }

    this.rect = null
    this.bRect = null
  }

  isProximate(proximity) {
    return !(proximity < -20 || proximity > 20)
  }

  topBottomDist(r1, r2) {
    return r1.y - (r2.y + r2.height)
  }

  bottomToTopDist(r1, r2) {
    return r1.y + r1.height - r2.y
  }

  updateStackProximity(block) {
    if (Math.abs(this.rect.x - this.bRect.x) > 50) {
      this.clearStack(block)
      return
    }

    if (
      block.hasNext &&
      this.block.hasPrev &&
      this.isProximate(this.topBottomDist(this.rect, this.bRect))
    ) {
      this.clearStack()
      block.proximity.next = this.block
      this.prev = block
      return
    }

    if (
      block.hasPrev &&
      this.block.hasNext &&
      this.isProximate(this.bottomToTopDist(this.rect, this.bRect))
    ) {
      this.clearStack()
      block.proximity.prev = this.block
      this.next = block
      return
    }

    this.clearStack(block)
  }

  updateInputsProximity(block) {
    if (!this.block.hasOutput) return

    let minDist = 100
    let closest = null
    for (const input of block.inputs) {
      if (input.type !== 'Value') continue

      const iRect = input.getBoundingClientRect()
      const values = [
        iRect.y - this.rect.y - 10,
        this.rect.y + this.rect.height - (iRect.y + iRect.height) - 10,
      ].filter((d) => this.isProximate(d))
      if (!values.length) continue

      const dist = Math.min(...values)
      if (dist > minDist) continue

      minDist = dist
      closest = input
    }

    if (!closest) return

    this.clearInput()
    this.input = closest
    closest.proximateBlock = this.block
  }

  clear(block = null) {
    this.clearStack(block)
    this.clearInput(block)
  }

  clearStack(block = null) {
    if (this.prev && (!block || this.prev.id == block.id)) {
      this.prev.proximity.next = null
    }

    if (this.next && (!block || this.next.id == block.id)) {
      this.next.proximity.prev = null
    }

    this.prev = null
    this.next = null
  }

  clearInput(block = null) {
    if (this.input && (!block || this.input.block.id == block.id)) {
      this.input.proximateBlock = null
    }

    this.input = null
  }
}
