import { Scratch } from '../src/types/scratch'
import { Block } from './types'
import { CompilerContext } from '../src/types/generator/context'

/**
 * @callback DynamicOptions
 * @param {Object} context
 * @param {Scratch} context.scratch
 * @param {Block} context.block
 * @param {BlockInput} context.input
 * @returns {Array<String>}
 *
 * @callback BlockCompiler
 * @param {CompilerContext} context
 * @returns {Array<String> | Object}
 *
 * @callback BlockUpdateHook
 * @param {Block} block
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
 * @property {BlockUpdateHook} BlockDefinition.updated
 * @property {Array<InputDeclaration>} BlockDefinition.inputs
 * @property {String} BlockDefinition.background
 * @property {String} BlockDefinition.text
 *
 * @typedef {Object} BlockDefinitionConfig
 * @param {String} BlockDefinitionConfig.prefix
 * @param {Object} BlockDefinitionConfig.style
 * @param {string} BlockDefinitionConfig.style.background
 * @param {string} BlockDefinitionConfig.style.text
 *
 * @param {Array<BlockDefinition>} blocksDefs
 * @param {BlockDefinitionConfig} config
 *
 * @callback BlockDefinitionBakedCallback
 * @param {Block} block
 * @typedef {Object.<String, BlockDefinitionBakedCallback>} BlockDefinitionBaked
 * @returns {BlockDefinitionBaked}
 */

export function defineBlocks(config, blocksDefs) {
  const blocks = {}
  for (const blockDef of blocksDefs) {
    const factory = defineBlock(config, blockDef)
    if (typeof factory !== 'function') continue

    blocks[blockDef.type] = factory
  }

  return blocks
}

/**
 * @param {BlockDefinitionConfig} config
 * @param {BlockDefinition} blockDef
 * @returns {function | null}
 */
export function defineBlock(config, blockDef) {
  if (!blockDef.type) {
    console.warn('block definition must have a type, got:', blockDef)
    return null
  }

  if (config?.style) {
    extendBlockStyles(config.style, blockDef)
  }

  const prefix = config?.prefix || ''
  blockDef.type = prefix ? `${prefix}:${blockDef.type}` : blockDef.type
  const factory = function (block) {
    block.applyDefinition(blockDef)
  }

  Scratch.DeclareBlock(blockDef.type, factory)

  return factory
}

function extendBlockStyles(styles, blockDef) {
  if (!blockDef.background) {
    blockDef.background = styles.background
  }

  if (!blockDef.text) {
    blockDef.text = styles.text
  }
}

export default { defineBlocks, defineBlock }
