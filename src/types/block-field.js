/**
 * @typedef {Object} BlockFieldOptions
 * @property {any} BlockFieldOptions.value
 * @property {String} BlockFieldOptions.placeholder
 * @property {Array<String>} BlockFieldOptions.options
 */

import { uuidv4 } from '../utils'
import { Point } from './point'
import { Scratch } from './scratch'

export class BlockField {
  static Text = 1
  static Label = 2
  static Select = 3
  static Number = 4
  static Variable = 5

  /**
   * @param {String} type
   * @param {BlockFieldOptions} options
   */
  constructor(name, type, block, input, options = null) {
    this.id = uuidv4()
    this.type = type
    this.block = block
    this.input = input

    this.width = 0
    this.height = 0
    this.position = new Point(0, 0)

    options = Object.assign(
      { value: null, placeholder: null, options: [] },
      options
    )
    this.name = name
    this.value_ = options.value
    this.placeholder = options.placeholder

    this.optionsUpdater = null
    if (typeof options.options == 'function') {
      this.optionsUpdater = options.options.bind(this)
      this.updateOptions()
    } else {
      this.options = options.options
    }
  }

  get value() {
    return this.value_
  }

  set value(value) {
    this.value_ = value
    this.block.scratch.renderer.update(this.block, { propagateUp: true })
  }

  updateOptions() {
    if (typeof this.optionsUpdater !== 'function') return

    this.options = this.optionsUpdater({
      scratch: this.block.scratch,
      block: this.block,
      input: this.input,
    })
  }

  toJSON() {
    return {
      id: this.id,
      value: this.value_,
    }
  }
}
