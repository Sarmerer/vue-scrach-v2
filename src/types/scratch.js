import { Proximity } from './proximity'
import { DOMElement } from './dom-element'
import { Block } from './block'
import { uuidv4 } from '../utils'
import { CodeGenerator } from './generator/code'
import { Generator } from './generator'
import { EventBus } from './event-bus'
import { Events } from './events'
import { Renderer } from './renderer'
import { DionysusRenderer } from '../renderers/dionysus/renderer'
import { AphroditeRenderer } from '../renderers/aphrodite/renderer'

export class Scratch extends DOMElement {
  static Blocks = {}
  static Events = Events
  static Renderers = {
    Dionysus: DionysusRenderer,
    Aphrodite: AphroditeRenderer,
  }
  static Renderer = Scratch.Renderers.Dionysus

  constructor() {
    const id = uuidv4()
    super(id)
    this.id = id

    this.blocks = []
    this.variables = []

    this.events = new EventBus()
    this.proximity = new Proximity(this)

    this.generator = null

    this.renderer = new Scratch.Renderer(this)
  }

  setRenderer(renderer) {
    if (!(renderer?.prototype instanceof Renderer)) {
      console.error('renderer must extend Renderer class:', renderer)
      return
    }

    Scratch.Renderer = renderer
    this.renderer = new renderer(this)
  }

  setGenerator(generator) {
    if (!(generator?.prototype instanceof Generator)) {
      console.error('generator must extend Generator class:', generator)
      return
    }

    this.generator = new generator(this)
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
    this.renderer.addDrawer(block)
    this.events.dispatch(Scratch.Events.BLOCK_CREATE, { block })
  }

  /** @param {Block} block */
  removeBlock(block) {
    if (!block) return

    const index = this.blocks.indexOf(block)
    if (index === -1) return

    this.blocks.splice(index, 1)
    this.events.dispatch(Scratch.Events.BLOCK_DELETE, { block })
  }

  getVariables() {
    return this.variables
  }

  addVariable(name, value) {
    this.variables.push({ name, value })
    this.events.dispatch(Scratch.Events.VARIABLE_CREATE, { name })
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

  toJSON() {
    return {
      id: this.id,
      blocks: this.blocks.map((b) => b.toJSON()),
      variables: this.variables.map((v) => ({ name: v.name, value: v.value })),
    }
  }

  /**
   *  @callback BlockTypeFactory
   * @param {Block} block
   *
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
