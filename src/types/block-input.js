export class BlockInput {
  /**
   * @param {any} value
   * @param {Object} options
   * @param {string} options.label
   * @param {Boolean} options.inline
   */
  constructor(value, options) {
    options = Object.assign({ label: null, inline: true }, options)
    this.value = value
    this.inline = options.inline
    this.label = options.label
  }
}
