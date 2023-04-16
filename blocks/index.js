/**
 * @callback DynamicOptions
 * @param {Object} context
 * @param {Scratch} context.scratch
 * @param {Block} context.block
 * @param {BlockInput} context.input
 * @returns {Array<String>}
 *
 * @callback BlockCompiler
 * @param {Object} context
 * @param {Block} block
 * @returns {Array<String> | Object}
 *
 * @typedef {Object} FieldDeclaration
 * @property {Number} FieldDeclaration.type
 * @property {String} FieldDeclaration.name
 * @property {any} FieldDeclaration.value
 * @property {any} FieldDeclaration.placeholder
 * @property {Array<String> | DynamicOptions} FieldDeclaration.options
 *
 * @typedef {Object} InputDeclaration
 * @property {Number} InputDeclaration.type
 * @property {String} InputDeclaration.name
 * @property {Array<FieldDeclaration>} InputDeclaration.fields
 *
 * @typedef {Object} BlockDefinition
 * @property {String} BlockDefinition.type
 * @property {Boolean} BlockDefinition.inline
 * @property {Boolean} BlockDefinition.output
 * @property {Boolean} BlockDefinition.previous
 * @property {Boolean} BlockDefinition.next
 * @property {Array<String> | BlockCompiler} BlockDefinition.compiler
 * @property {Array<InputDeclaration>} BlockDefinition.inputs
 *
 *
 * @param {Array<BlockDefinition>} blocksDefs
 * @param {Object} config
 * @param {String} config.prefix
 *
 * @param {Object} config.style
 * @param {string} config.style.background
 * @param {string} config.style.text
 *
 * @callback BlockDefinitionBakedCallback
 * @param {Block} block
 * @typedef {Object.<String, BlockDefinitionBakedCallback>} BlockDefinitionBaked
 * @returns {BlockDefinitionBaked}
 */

export function defineBlocks(config, blocksDefs) {
  const blocks = {}
  for (const blockDef of blocksDefs) {
    if (!blockDef.type) {
      console.warn('block definition must have a type, got:', blockDef)
      continue
    }

    if (config?.style) {
      extendBlockStyles(config.style, blockDef)
    }

    const prefix = config?.prefix || ''
    blockDef.type = prefix ? `${prefix}:${blockDef.type}` : blockDef.type
    blocks[blockDef.type] = function (block) {
      block.applyDefinition(blockDef)
    }
  }

  return blocks
}

function extendBlockStyles(styles, blockDef) {
  if (!blockDef.background) {
    blockDef.background = styles.background
  }

  if (!blockDef.text) {
    blockDef.text = styles.text
  }
}

export default { defineBlocks }
