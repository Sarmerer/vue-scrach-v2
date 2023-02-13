import { Scratch } from '../types/scratch'
import functions from './functions'
import loops from './loops'
import sql from './sql'

const enabledModules = [sql, functions, loops]

export function declare() {
  for (const module of enabledModules) {
    declareModule(module)
  }
}

export function declareModule(module) {
  let prefix = ''
  if (typeof module.name == 'string' && module.name.length > 0) {
    prefix = `${module.name}:`
  }

  for (const source of module.blocks) {
    const name = prefix + source.name

    function factory(factoryBlock) {
      addInputs(source.inputs, factoryBlock)
      addConnections(source.connections, factoryBlock)
      setMisc(source, factoryBlock)
      setStyle(module.style, factoryBlock)
    }

    Scratch.DeclareBlock(name, factory)
  }
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
    factoryBlock.setCompileTemplate(source.compile)
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
 * @property {Array<String>} BlockDeclaration.compile
 * @property {Array<Number>} BlockDeclaration.connections
 * @property {Array<InputDeclaration>} BlockDeclaration.inputs
 *
 * @typedef {Object} BlocksModuleStyle
 * @property {string} BlocksModuleStyle.background
 * @property {string} BlocksModuleStyle.text
 *
 * @typedef {Object} BlocksModule
 * @property {String} BlockTypesModule.name
 * @property {Array<BlockDeclaration>} BlockTypesModule.blocks
 * @property {BlocksModuleStyle} BlockTypesModule.style
 *
 * @param {BlocksModule} module
 * @returns {BlocksModule}
 */
export function createModule(module) {
  return module
}

export default { declare, declareModule }
