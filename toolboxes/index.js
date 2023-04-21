import { Generator } from '../src/types/generator'

/**
 * @typedef {Object} CategoryDefinition
 * @property {String} CategoryDefinition.name
 * @property {Array<import('../blocks').BlockDefinition>} CategoryDefinition.blocks
 *
 * @typedef {Object} ToolboxDefinition
 * @property {Array<import("../blocks").BlockDefinition>} ToolboxDefinition.blocks
 * @property {Array<CategoryDefinition>} ToolboxDefinition.categories
 *
 * @typedef {Generator} generator
 *
 * @param {ToolboxDefinition} definition
 * @returns {ToolboxDefinition}
 */
export function defineToolbox(definition) {
  return {
    generator: definition.generator,
    blocks: definition.blocks,
    categories: definition.categories,
  }
}

export default { defineToolbox }
