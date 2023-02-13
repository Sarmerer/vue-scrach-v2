import { Proximity } from './proximity'
import { DOMElement } from './dom-element'
import { Block } from './block'
import { uuidv4 } from '../utils'
import blocks from '../blocks'
import { CodeGenerator } from './generator/code'

export class Scratch extends DOMElement {
  static Blocks = {}

  constructor() {
    const id = uuidv4()
    super(id)
    this.id = id

    this.blocks = []
    this.variables = []

    this.proximity = new Proximity(this)
    this.generator = new CodeGenerator(this)
  }

  /** @returns {Array<Block>} */
  getBlocks() {
    return this.blocks.filter((b) => !b.isRelative())
  }

  /** @returns {Block | null} */
  getActiveBlock() {
    return this.blocks.find((b) => b.isDragged)
  }

  /**
   * @param {String} type
   * @param {Number} x
   * @param {Number} y
   */
  spawnBlock(type, x = 0, y = 0) {
    const factory = Scratch.Blocks[type]
    if (!factory) {
      console.error('unknown block type:', type)
      return
    }

    const block = new Block(this, x, y, type)
    factory(block)
    this.addBlock(block)

    return block
  }

  /** @param {Block} block */
  addBlock(block) {
    if (!block.scratch) {
      block.scratch = this
    }

    this.blocks.push(block)
  }

  /** @param {Block} block */
  removeBlock(block) {
    if (!block) return

    const index = this.blocks.indexOf(block)
    if (index === -1) return

    this.blocks.splice(index, 1)
  }

  addVariable(variable) {
    this.variables.push(variable)
  }

  removeVariable(variable) {
    if (!variable) return

    const index = this.variables.indexOf(variable)
    if (index == -1) return

    this.variables.splice(index, 1)
  }

  /**
   * @param {MouseEvent} event
   * @returns {MouseEvent}
   */
  normalizeMouseEvent(event) {
    if (event.normalized) return event

    const rect = this.getBoundingClientRect()
    const normalized = new MouseEvent('mousemove', {
      clientX: event.clientX - rect.x,
      clientY: event.clientY - rect.y,
    })

    normalized.normalized = true
    return normalized
  }

  /**
   * @typedef {Object} Point
   * @property {Number} x
   * @property {Number} y
   *
   * @param {Number} x
   * @param {Number} y
   * @returns {Point}
   */
  normalizePosition(x, y) {
    const rect = this.getBoundingClientRect()
    return { x: x - rect.x, y: y - rect.y }
  }

  /**
   *  @callback BlockTypeFactory
   * @param {Block} block
   */

  /**
   * @param {String} name
   * @param {BlockTypeFactory} factory
   */
  static DeclareBlock(name, factory) {
    if (Scratch.Blocks[name]) {
      console.warn('overriding existing block type with name:', name)
    }

    Scratch.Blocks[name] = factory
  }
}

blocks.declare()
