/**
 * @typedef {Object} BlockFieldOptions
 * @property {any} BlockFieldOptions.value
 * @property {String} BlockFieldOptions.placeholder
 * @property {Array<String>} BlockFieldOptions.options
 */

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
    this.type = type
    this.block = block
    this.input = input

    options = Object.assign(
      { value: null, placeholder: null, options: [] },
      options
    )
    this.name = name
    this.value = options.value
    this.placeholder = options.placeholder

    this.optionsUpdater = null
    if (typeof options.options == 'function') {
      this.optionsUpdater = options.options.bind(this)
      this.updateOptions()
    } else {
      this.options = options.options
    }
  }

  updateOptions() {
    if (typeof this.optionsUpdater !== 'function') return

    this.options = this.optionsUpdater({
      scratch: this.block.scratch,
      block: this.block,
      input: this.input,
    })
  }
}
