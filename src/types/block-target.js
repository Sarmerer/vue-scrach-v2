import { Block } from './block'
import { BlockComponent } from './block-component'

export class BlockTarget {
  constructor() {
    this.type = null
    this.block = null
    this.component = null
    this.index = -1
  }

  /**
   * @param {'child' | 'before' | 'after'} type
   * @param {Object} target
   * @param {BlockComponent} target.component
   * @param {Block} target.block
   */
  set(type, target = {}) {
    target = Object.assign(
      {
        block: null,
        component: null,
        index: -1,
      },
      target
    )

    this.type = type
    this.block = target.block
    this.component = target.component
    this.index = target.index
  }

  reset() {
    this.type = null
    this.block = null
    this.component = null
    this.index = null
  }
}
