import { Scratch } from '../src/types/scratch'

export function declareModule(module) {
  for (const source of module.blocks) {
    if (!source.style) {
      source.style = module.style
    }

    declareBlock(source, module.name)
  }
}

export function declareBlock(source, prefix) {
  let name = source.name
  if (typeof prefix == 'string' && prefix.length > 0) {
    name = `${prefix}:${name}`
  }

  Scratch.DeclareBlock(name, newFactory(source))
}

export function newFactory(template) {
  return function (block) {
    addInputs(template.inputs, block)
    addConnections(template.connections, block)
    setMisc(template, block)
    setStyle(template.style, block)
  }
}

function addInputs(inputs, block) {
  if (!Array.isArray(inputs)) return

  for (const inputTemplate of inputs) {
    const input = block.addInput(inputTemplate.type, inputTemplate.name)
    if (!input) continue

    addFields(inputTemplate.fields, input)
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

export default { declareModule }
