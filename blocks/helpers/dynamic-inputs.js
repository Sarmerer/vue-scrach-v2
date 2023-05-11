import { BlockValueInput } from '../../src/types/block-input'
import { Block, BlockInput } from '../types'

/**
 * @param {Number} from
 * @param {Number} to
 * @returns {Function}
 */
export function dynamicValueInputs(from = 0, to = -1) {
  /**
   * @param {Block} block
   */
  return function (block) {
    const didRemove = removeRedundantInputs(block, from, to)
    const didAdd = addExtraInput(block, to)
    if (!didRemove && !didAdd) return

    for (let i = 0; i < block.inputs.length; i++) {
      block.inputs[i].index = i
    }

    block.scratch.renderer.update(block, {})
  }
}

/**
 * @param {Block} block
 * @param {Number} from
 * @param {Number} to
 */
function removeRedundantInputs(block, from, to) {
  const lastIndex = block.inputs.length + to
  if (lastIndex - from < 1) return false

  const redundant = []
  for (let i = lastIndex - 1; i > from; i--) {
    const input = block.inputs[i]
    if (input.connection.isConnected()) break

    redundant.push(input)
  }

  if (!redundant.length) return false

  for (const input of redundant) {
    block.scratch.proximity.removeConnection(input.connection)
    block.inputs.splice(input.index, 1)
  }

  return true
}

/**
 * @param {Block} block
 * @param {Number} at
 */
function addExtraInput(block, at) {
  const lastInput = block.inputs.at(at)
  if (lastInput.type !== BlockInput.Value) return false

  const target = lastInput.connection.getTargetBlock()
  if (!target || target.isShadow) return false

  const name = `field${block.inputs.length - 1}`
  const newInput = new BlockValueInput(block, name)
  block.inputs.splice(at + 1, 0, newInput)
  block.scratch.proximity.addConnection(newInput.connection)
  return true
}
