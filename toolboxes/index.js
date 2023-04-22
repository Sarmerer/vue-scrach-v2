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

export function withStyle(styleDef) {
  return {
    background: getStyleDefProperty(styleDef, 'background'),
    text: getStyleDefProperty(styleDef, 'text'),
  }
}

function getStyleDefProperty(source, property) {
  return source?.[property] || source?.style?.[property] || null
}

export default { defineToolbox, withStyle }
