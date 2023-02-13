import { Scratch } from '../types/scratch'
import builder from './builder'
import functions from './functions'
import loops from './loops'
import math from './math'
import sql from './sql'
import strings from './strings'

const enabledModules = [math, strings, sql, functions, loops]

export function declare() {
  for (const module of enabledModules) {
    declareModule(module)
  }
}

export function declareModule(module) {
  for (const source of module.blocks) {
    if (!source.style) {
      source.style = module.style
    }

    declareBlock(source, module.name)
  }
}

export function declareBlock(source, prefix) {
  function factory(factoryBlock) {
    addInputs(source.inputs, factoryBlock)
    addConnections(source.connections, factoryBlock)
    setMisc(source, factoryBlock)
    setStyle(source.style, factoryBlock)
  }

  let name = source.name
  if (typeof prefix == 'string' && prefix.length > 0) {
    name = `${prefix}:${name}`
  }

  Scratch.DeclareBlock(name, factory)
}

function addInputs(inputs, factory) {
  if (!Array.isArray(inputs)) return

  for (const input of inputs) {
    const factoryInput = factory.addInput(input.type, input.name)
    if (!factoryInput) continue

    addFields(input.fields, factoryInput)
  }
}

function addFields(fields, factoryInput) {
  if (!Array.isArray(fields)) return

  for (const field of fields) {
    factoryInput.addField(field.type, field.name, field)
  }
}

function addConnections(connections, factory) {
  if (!Array.isArray(connections)) return

  for (const connection of connections) {
    factory.allowConnection(connection)
  }
}

function setMisc(source, factoryBlock) {
  if (source.inline) {
    factoryBlock.setInline()
  }

  if (source.compile) {
    factoryBlock.setCompiler(source.compile)
  }
}

function setStyle(style, factoryInput) {
  if (!style) return

  if (style.background) {
    factoryInput.setBackgroundColor(style.background)
  }

  if (style.text) {
    factoryInput.setTextColor(style.text)
  }
}

/**
 * @callback DynamicOptions
 * @returns {Array<String>}
 *
 * @callback BlockCompiler
 * @param {Object} context
 * @param {Block} block
 * @returns {Array<String>}
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
 * @typedef {Object} BlockDeclaration
 * @property {String} BlockDeclaration.name
 * @property {Boolean} BlockDeclaration.inline
 * @property {Array<String> | BlockCompiler} BlockDeclaration.compile
 * @property {Array<Number>} BlockDeclaration.connections
 * @property {Array<InputDeclaration>} BlockDeclaration.inputs
 *
 * @typedef {Object} BlocksModuleStyle
 * @property {string} BlocksModuleStyle.background
 * @property {string} BlocksModuleStyle.text
 *
 * @typedef {Object} BlocksModule
 * @property {String} BlocksModule.name
 * @property {Array<BlockDeclaration>} BlocksModule.blocks
 * @property {BlocksModuleStyle} BlocksModule.style
 *
 * @param {BlocksModule} module
 * @returns {BlocksModule}
 */
export function createModule(module) {
  return module
}

/**
 * @param {BlockDeclaration} block
 * @returns {BlockDeclaration}
 */
export function createBlockType(block) {
  return block
}

export default { declare, declareModule }
