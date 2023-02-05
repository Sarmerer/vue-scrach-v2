import { Block } from './block'
import { BlockInput } from './block-input'

export class BlockTarget {
  constructor() {
    this.type = null
    this.block = null
    this.input = null
    this.index = -1
  }

  /**
   * @param {'statement' | 'prev' | 'next'} type
   * @param {Object} target
   * @param {BlockInput} target.input
   * @param {Block} target.block
   * @param {Number} target.index
   */
  set(type, target = {}) {
    target = Object.assign(
      {
        block: null,
        input: null,
        index: -1,
      },
      target
    )

    this.type = type
    this.block = target.block
    this.input = target.input
    this.index = target.index
  }

  reset() {
    this.type = null
    this.block = null
    this.input = null
    this.index = null
  }
}
