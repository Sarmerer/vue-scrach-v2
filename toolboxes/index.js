/**
 * @typedef {Object} CategoryDefinition
 * @property {String} CategoryDefinition.name
 * @property {Array<import('../blocks').BlockDefinition>} CategoryDefinition.blocks
 *
 * @typedef {Object} ToolboxDefinition
 * @property {Array<import("../blocks").BlockDefinition>} ToolboxDefinition.blocks
 * @property {Array<CategoryDefinition>} ToolboxDefinition.categories
 *
 * @param {ToolboxDefinition} definition
 * @returns {ToolboxDefinition}
 */
export function defineToolbox(definition) {
  return {
    blocks: definition.blocks || [],
    categories: definition.categories || [],
  }
}

export default { defineToolbox }
