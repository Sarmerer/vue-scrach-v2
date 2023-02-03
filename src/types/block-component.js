import { Block } from './block'

export class BlockComponent {
  /**
   * @param {string} type
   * @param {Object} options
   * @param {string} options.text
   * @param {Array<Block>} options.children
   */
  constructor(type = 'Header', options) {
    this.type = type

    options = Object.assign({ text: '', children: [] }, options || {})
    this.text = options.text
    this.children = options.children
  }
}
