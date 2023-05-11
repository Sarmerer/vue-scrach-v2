import { Block, BlockInput } from '../types'

/**
 * @param {import('..').BlockDefinition} placeholderDefinition
 * @returns {Function}
 */
export function blockPlaceholder(placeholderDefinition) {
  let placeholderCache = null
  /**
   * @param {Block} block
   */
  return function (block) {
    for (const input of block.inputs) {
      if (input.type !== BlockInput.Statement) continue
      if (input.connection.isConnected()) {
        const target = input.connection.getTargetBlock()
        if (target.id === placeholderCache.id) {
          block.scratch.removeBlock(placeholderCache)
        }

        continue
      }

      const placeholder = new Block(block.scratch)
      placeholder.applyDefinition(placeholderDefinition)
      placeholder.freeze()
      Object.assign(placeholder.colors, { background: 'lightgrey' })

      placeholderCache = placeholder
      block.scratch.addBlock(placeholder)
      input.connection.connectToBlock(placeholder)
    }
  }
}
