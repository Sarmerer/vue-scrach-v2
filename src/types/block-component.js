import { uuidv4 } from '../utils'
import { Block } from './block'
import { BlockInput } from './block-input'

export class BlockComponent {
  /**
   * @param {string} type
   * @param {Object} options
   * @param {string} options.text
   * @param {Array<Block>} options.children
   * @param {Array<BlockInput>} options.inputs
   */
  constructor(type = 'Header', options) {
    this.id = uuidv4()
    this.type = type

    options = Object.assign(
      { text: '', children: [], inputs: [] },
      options || {}
    )
    this.text = options.text
    this.children = options.children
    this.inputs = options.inputs
  }

  /**
   * @param {Block} block
   */
  addChild(block, index) {
    if (index < 0 || index > this.children.length) {
      this.children.push(block.id)
      return
    }

    this.children.splice(index, 0, block.id)
  }

  /**
   * @param {Block} block
   */
  removeChild(block) {
    const index = this.children.indexOf(block.id)
    if (index < 0) return

    this.children.splice(index, 1)
  }
}
